import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { db } from "@/firebase/admin";

export const maxDuration = 30;

const VALID_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX only
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): string | null {
  if (!file) return "No file uploaded";
  if (!VALID_TYPES.includes(file.type)) return "Invalid file type. Only DOCX files are supported.";
  if (file.size > MAX_SIZE_BYTES) return "File size must be less than 10MB";
  return null;
}

async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

function buildGeminiPrompt(resumeText: string, jobDescription: string = ""): string {
  return `Role: You are an advanced Applicant Tracking System (ATS) scanner designed to evaluate resumes for compliance, optimization, and overall effectiveness. Your task is to analyze the provided resume and role or job description and provide a detailed assessment based on key ATS-friendly criteria.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription || "No job description provided"}
"""

Provide a comprehensive analysis with the following sections:

1. ATS Compatibility Score (0-100) - Estimate how well the resume will parse in Applicant Tracking Systems
2. Keyword Matching - List matched and missing keywords from the job description
3. Strengths - Highlight 3-5 strong points of the resume
4. Weaknesses - Identify 3-5 areas that need improvement
5. Suggestions - Provide actionable recommendations to improve the resume

Format your response as valid JSON:
{
  "atsScore": number,
  "keywordAnalysis": {
    "matched": string[],
    "missing": string[]
  },
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[]
}`;
}

function buildEnhancementPrompt(resumeText: string, analysis: any, jobDescription: string = ""): string {
  // Safely get array properties with fallbacks
  const strengths = Array.isArray(analysis?.strengths) ? analysis.strengths : [];
  const weaknesses = Array.isArray(analysis?.weaknesses) ? analysis.weaknesses : [];
  const suggestions = Array.isArray(analysis?.suggestions) ? analysis.suggestions : [];
  const atsScore = typeof analysis?.atsScore === 'number' ? analysis.atsScore : 0;

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
- ATS Score: ${atsScore}
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
- Professional Summary (3-4 lines)
- Key Skills (bullet points)
- Professional Experience (with achievements)
- Education
- Certifications (if applicable)
- Projects (if applicable)

Return ONLY the enhanced resume content in proper formatting (don't include analysis or explanations). Use clear section headings, bullet points for lists, and maintain professional formatting.`;
}

function cleanGeminiResponse(raw: string): string {
  try {
    // First try to parse directly if it's clean JSON
    JSON.parse(raw);
    return raw;
  } catch {
    // If not, try to clean it
    const cleaned = raw
      .replace(/^```(json)?/gm, "")
      .replace(/```$/gm, "")
      .replace(/\/\/.*$/gm, "")
      .replace(/[^\x20-\x7E\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]/g, '')
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Remove any remaining non-JSON content
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}') + 1;
    return cleaned.slice(jsonStart, jsonEnd);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("resume") as File;
  const userid = formData.get("userid") as string;
  const jobDescription = formData.get("jobDescription") as string;

  const validationError = validateFile(file);
  if (validationError) {
    return NextResponse.json({ success: false, error: validationError }, { status: 400 });
  }

  try {
    const resumeText = (await extractTextFromFile(file)).trim();

    if (!resumeText) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from the resume" },
        { status: 400 }
      );
    }

    const prompt = buildGeminiPrompt(resumeText, jobDescription);
    const { text: analysis } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: prompt,
    });

    const cleaned = cleanGeminiResponse(analysis);

    const parsedAnalysis = JSON.parse(cleaned);

    const newPrompt = buildEnhancementPrompt(resumeText, parsedAnalysis, jobDescription);
    const { text: enhancedResume } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: newPrompt,
    });

    const resumeData = {
      userid,
      createdAt: new Date(),
      oldResumeText: resumeText,
      analysis: parsedAnalysis,
      enhancedResume: enhancedResume,
      id: "",
    };

    const resumeRef = await db.collection("resumes").add(resumeData);
    await resumeRef.update({ resumeId: resumeRef.id });
    // console.log("Resume analysis saved with ID:", resumeRef.id);

    return NextResponse.json({ success: true, analysis: parsedAnalysis, id: resumeRef.id }, { status: 200 });
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}