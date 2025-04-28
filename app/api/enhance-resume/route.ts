import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

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

  try {
    const requestData = await request.json();
    resumeId = requestData.resumeId;
    
    if (!resumeId) {
      return NextResponse.json(
        { success: false, error: "Missing resume ID." }, 
        { status: 400 }
      );
    }

    const resumeDoc = await db.collection("resumes").doc(resumeId).get();

    if (!resumeDoc.exists) {
      return NextResponse.json(
        { success: false, error: "Resume not found." },
        { status: 404 }
      );
    }

    const resumeData = resumeDoc.data() as ResumeData;

    // Check for existing enhanced resume first
    if (resumeData?.enhancedResumeText) {
      console.log("Returning Existing Resume");
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
      return NextResponse.json(
        { success: false, error: "Incomplete resume data in database." },
        { status: 400 }
      );
    }

    // Generate enhanced resume
    const prompt = buildEnhancementPrompt(
      resumeData.oldResumeText, 
      resumeData.analysis, 
      resumeData.jobDescription
    );

    const { text: enhancedResume } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: prompt,
      maxTokens: 3000,
      temperature: 0.2,
    });

    const htmlPrompt = resumeToHTML(enhancedResume);
    const { text: htmlResume } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: htmlPrompt,
      maxTokens: 3000,
      temperature: 0.2,
    });

    // Save to Firestore
    const updateData = {
      enhancedResumeText: enhancedResume,
      enhancedAt: new Date().toISOString(),
      enhancementFailed: false,
      htmlResume: htmlResume,
    };

    await db.collection("resumes").doc(resumeId).update(updateData);

    return NextResponse.json(
      { success: true, enhancedResume },
      { status: 200 }
    );

  } catch (error) {
    if (resumeId && error instanceof Error && error.message.includes("resumeId")) {
    
    // Update Firestore with failure status if we have the resumeId
    if (error instanceof Error && error.message.includes("resumeId")) {
      try {
        await db.collection("resumes").doc(resumeId).update({
          enhancementFailed: true,
          enhancedAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error("Failed to update failure status:", dbError);
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
}

export async function GET() {
  return NextResponse.json(
    { success: true, message: "Resume enhancement service is operational" },
    { status: 200 }
  );
}