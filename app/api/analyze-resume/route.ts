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
6. Infer the role based on the Job Description provided

Format your response as valid JSON:
{
  "atsScore": number,
  "keywordAnalysis": {
    "matched": string[],
    "missing": string[]
  },
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "jobRole": string[]
}
  
Return only the valid JSON make sure the response is a valid JSON before returning it.
`;
}


function cleanGeminiResponse(raw: string): string {
  // Try direct parse first
  try {
    JSON.parse(raw);
    return raw;
  } catch {}

  // Remove markdown code fences and comments
  let cleaned = raw
    .replace(/^```(?:json)?/gm, '')
    .replace(/```$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  // Try to find a valid JSON object or array
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  let jsonStart = -1;
  if (firstBrace !== -1 && (firstBrace < firstBracket || firstBracket === -1)) {
    jsonStart = firstBrace;
  } else if (firstBracket !== -1) {
    jsonStart = firstBracket;
  }

  const jsonEnd = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']')) + 1;
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error("Could not locate valid JSON start/end");
  }

  const sliced = cleaned.slice(jsonStart, jsonEnd);

  try {
    JSON.parse(sliced);
    return sliced;
  } catch (err) {
    console.error("Invalid cleaned JSON:\n", sliced);
    throw new Error("Still not valid JSON after cleanup");
  }
}

async function getValidGeminiResponse(prompt: string, maxRetries = 3): Promise<any> {
  let retries = 0;
  let lastError = null;

  while (retries < maxRetries) {
    try {
      const { text: analysis } = await generateText({
        model: google("gemini-1.5-pro"),
        prompt: prompt,
      });

      const cleaned = cleanGeminiResponse(analysis);
      return JSON.parse(cleaned);
    } catch (error) {
      lastError = error;
      retries++;
      if (retries < maxRetries) {
        // Add a small delay before retrying
        await new Promise(resolve => setTimeout(resolve, 500 * retries));
      }
    }
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
    const parsedAnalysis = await getValidGeminiResponse(prompt);

    const resumeData = {
      userid,
      createdAt: new Date().toISOString(),
      oldResumeText: resumeText,
      analysis: parsedAnalysis,
      jobDescription: jobDescription,
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
  return Response.json({ success: true, data: "Resume enhancement analytics is operational" }, { status: 200 });
}