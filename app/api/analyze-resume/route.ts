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

function cleanGeminiResponse(raw: string): string {
  return raw
  .replace(/^```json/gm, "")
  .replace(/^```/gm, "")
  .replace(/\/\/.*$/gm, "") // Remove single-line comments
  .replace(/[^\x20-\x7E\u00a9\u00ae\u2000-\u3300\ud83c\ud000-\udfff\ud83d\ud000-\udfff\ud83e\ud000-\udfff]/g, '') // Remove extended non-ASCII characters
  .split('\n')
  .map(line => line.trim()) // Trim whitespace from each line
  .join('\n')
  .replace(/\s+/g, ' ') // Condense multiple spaces into single spaces
  .trim();
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
      prompt,
    });

    console.log("Raw Gemini Analysis:", analysis);

    const cleaned = cleanGeminiResponse(analysis);
    console.log("Cleaned Gemini Analysis:", cleaned);

    const parsedAnalysis = JSON.parse(cleaned);

    const resumeData = {
      userid,
      createdAt: new Date(),
      analysis: parsedAnalysis,
    };

    const resumeRef = await db.collection("resumes").add(resumeData);
    console.log("Resume analysis saved with ID:", resumeRef.id);

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