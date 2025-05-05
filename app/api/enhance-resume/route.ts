import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { Logger } from "@/lib/logger";

interface ResumeAnalysis {
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  atsScore?: number;
}

interface ResumeData {
  oldResumeText?: string;
  enhancedResumeText?: string;
  analysis?: ResumeAnalysis;
  jobDescription?: string;
  enhancedAt?: Date;
  enhancementFailed?: boolean;
}

function resumeToHTML(enhancedResumeText: string){

  return `You are a highly skilled HTML generator.

Given the following unstructured resume text, your task is to convert it into clean, semantically structured HTML.

Guidelines:

Organize the resume into standard sections like Name, Contact Information, Summary, Experience, Education, Skills, and Projects (only if mentioned).

Use appropriate HTML tags:

<h2> for the candidate name

<h3> for main sections (e.g., "Experience", "Education")

<h5> for job titles, degrees, etc.

<p> for paragraphs (summaries, descriptions)

<ul> and <li> for skills, achievements, responsibilities

Do not invent any new information. Only use what is present in the text.

Preserve the chronological order if dates are provided.

Clean up the text (fix typos, formatting inconsistencies if obvious), but keep original content.

Ensure that the HTML is properly indented and readable.

Here is the unstructured resume text:
${enhancedResumeText}
Return only the formatted HTML, no explanations or extra text.`
}

function buildEnhancementPrompt(resumeText: string, analysis: ResumeAnalysis = {}, jobDescription: string = ""): string {
  // Safely get array properties with fallbacks
  const strengths = analysis?.strengths ?? [];
  const weaknesses = analysis?.weaknesses ?? [];
  const suggestions = analysis?.suggestions ?? [];
  const atsScore = analysis?.atsScore ?? 0;

  return `Role: You are a professional resume writer with expertise in ATS optimization. Your task is to create an enhanced version of the provided resume that addresses all the weaknesses and incorporates all suggestions from the analysis, while maintaining the original strengths.

Original Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription || "No job description provided"}
"""

Analysis Summary:
- ATS Score: ${atsScore}/100
- Strengths: ${strengths.length > 0 ? strengths.join(", ") : "None identified"}
- Weaknesses: ${weaknesses.length > 0 ? weaknesses.join(", ") : "None identified"}
- Suggestions: ${suggestions.length > 0 ? suggestions.join(", ") : "None provided"}

Create a significantly enhanced resume with these improvements:
1. Optimize for ATS with proper formatting and structure
2. Incorporate all missing keywords from the job description naturally
3. Address all weaknesses from the analysis
4. Implement all suggestions while preserving the original strengths
5. Use professional, achievement-oriented language with quantifiable results
6. Ensure perfect grammar, spelling, and consistency
7. Include a skills section tailored to the job description
8. Structure work experience using the STAR method (Situation, Task, Action, Result)
9. Add measurable achievements with metrics where possible
10. Use powerful action verbs and industry-specific terminology

Format the enhanced resume with these sections:
- Professional Summary (3-4 lines highlighting key qualifications)
- Key Skills (6-8 bullet points tailored to the job)
- Professional Experience (with achievements in STAR format)
- Education (with relevant details)
- Certifications (if applicable)
- Projects (if relevant, with impact metrics)

Return ONLY the enhanced resume content in proper formatting (don't include analysis or explanations). Use clear section headings, bullet points for lists, and maintain professional formatting with consistent spacing.`;
}

export async function POST(request: Request) {
  let resumeId: string | undefined;
  const startTime = Date.now();

  try {
    Logger.info('Starting resume enhancement request');
    
    const requestData = await request.json();
    resumeId = requestData.resumeId;
    
    Logger.info('Received request data', {
      resumeId,
      requestDataKeys: Object.keys(requestData)
    });

    if (!resumeId) {
      Logger.error('Missing resume ID in request');
      return NextResponse.json(
        { success: false, error: "Missing resume ID." }, 
        { status: 400 }
      );
    }

    Logger.info('Fetching resume from Firestore', { resumeId });
    const resumeDoc = await db.collection("resumes").doc(resumeId).get();

    if (!resumeDoc.exists) {
      Logger.error('Resume not found in Firestore', { resumeId });
      return NextResponse.json(
        { success: false, error: "Resume not found." },
        { status: 404 }
      );
    }

    const resumeData = resumeDoc.data() as ResumeData;
    Logger.info('Retrieved resume data', {
      resumeId,
      hasOldResume: !!resumeData.oldResumeText,
      hasAnalysis: !!resumeData.analysis,
      hasJobDescription: !!resumeData.jobDescription
    });

    // Check for existing enhanced resume first
    if (resumeData?.enhancedResumeText) {
      Logger.info('Returning cached enhanced resume', { resumeId });
      return NextResponse.json(
        { 
          success: true, 
          enhancedResume: resumeData.enhancedResumeText,
          fromCache: true 
        },
        { status: 200 }
      );
    }

    // Validate required data
    if (!resumeData?.oldResumeText || !resumeData?.analysis) {
      Logger.error('Incomplete resume data in database', {
        resumeId,
        missingFields: [
          !resumeData.oldResumeText ? 'oldResumeText' : '',
          !resumeData.analysis ? 'analysis' : ''
        ].filter(Boolean)
      });
      return NextResponse.json(
        { success: false, error: "Incomplete resume data in database." },
        { status: 400 }
      );
    }

    // Generate enhanced resume
    Logger.info('Building enhancement prompt', { resumeId });
    const prompt = buildEnhancementPrompt(
      resumeData.oldResumeText, 
      resumeData.analysis, 
      resumeData.jobDescription
    );

    Logger.info('Generating enhanced resume text with Gemini', {
      resumeId,
      promptLength: prompt.length
    });
    
    const { text: enhancedResume } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: prompt,
      maxTokens: 3000,
      temperature: 0.2,
    });

    Logger.info('Successfully generated enhanced resume', {
      resumeId,
      enhancedResumeLength: enhancedResume.length
    });

    Logger.info('Generating HTML version of resume', { resumeId });
    const htmlPrompt = resumeToHTML(enhancedResume);
    const { text: htmlResume } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: htmlPrompt,
      maxTokens: 3000,
      temperature: 0.2,
    });

    Logger.info('Successfully generated HTML resume', {
      resumeId,
      htmlResumeLength: htmlResume.length
    });

    // Save to Firestore
    const updateData = {
      enhancedResumeText: enhancedResume,
      enhancedAt: new Date().toISOString(),
      enhancementFailed: false,
      htmlResume: htmlResume,
    };

    Logger.info('Updating Firestore with enhanced resume', { resumeId });
    await db.collection("resumes").doc(resumeId).update(updateData);

    Logger.info('Successfully completed resume enhancement', {
      resumeId,
      durationMs: Date.now() - startTime
    });

    return NextResponse.json(
      { success: true, enhancedResume },
      { status: 200 }
    );

  } catch (error) {
    Logger.error('Error during resume enhancement', {
      resumeId,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : 'Unknown error',
      durationMs: Date.now() - startTime
    });

    // Update Firestore with failure status if we have the resumeId
    if (resumeId) {
      try {
        Logger.info('Recording enhancement failure in Firestore', { resumeId });
        await db.collection("resumes").doc(resumeId).update({
          enhancementFailed: true,
          enhancedAt: new Date().toISOString(),
        });
      } catch (dbError) {
        Logger.error('Failed to update failure status in Firestore', {
          resumeId,
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  Logger.info('Health check endpoint called');
  return NextResponse.json(
    { success: true, message: "Resume enhancement service is operational" },
    { status: 200 }
  );
}