import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { db } from "@/firebase/admin";
import { Logger } from "@/lib/logger";

export const maxDuration = 30;

const VALID_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX only
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function validateFile(file: File): string | null {
  if (!file) {
    Logger.error('No file provided for validation');
    return "No file uploaded";
  }
  
  if (!VALID_TYPES.includes(file.type)) {
    Logger.error('Invalid file type', { 
      fileType: file.type,
      validTypes: VALID_TYPES 
    });
    return "Invalid file type. Only DOCX files are supported.";
  }
  
  if (file.size > MAX_SIZE_BYTES) {
    Logger.error('File size exceeds limit', {
      fileSize: file.size,
      maxSize: MAX_SIZE_BYTES
    });
    return "File size must be less than 10MB";
  }
  
  Logger.info('File validation passed', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  });
  return null;
}

async function extractTextFromFile(file: File): Promise<string> {
  try {
    Logger.info('Starting file text extraction', { fileName: file.name });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await mammoth.extractRawText({ buffer });
    
    Logger.info('Successfully extracted text from file', {
      fileName: file.name,
      textLength: result.value.length
    });
    return result.value;
  } catch (error) {
    Logger.error('Failed to extract text from file', {
      fileName: file.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
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
  Logger.info('Cleaning Gemini response', { responseLength: raw.length });
  
  try {
    JSON.parse(raw);
    Logger.debug('Response was already valid JSON');
    return raw;
  } catch {}

  let cleaned = raw
    .replace(/^```(?:json)?/gm, '')
    .replace(/```$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

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
    Logger.error('Could not locate valid JSON in response', { cleanedResponse: cleaned });
    throw new Error("Could not locate valid JSON start/end");
  }

  const sliced = cleaned.slice(jsonStart, jsonEnd);

  try {
    JSON.parse(sliced);
    Logger.info('Successfully cleaned and validated JSON response');
    return sliced;
  } catch (err) {
    Logger.error('Invalid cleaned JSON', {
      slicedJson: sliced,
      error: err instanceof Error ? err.message : 'Unknown error'
    });
    throw new Error("Still not valid JSON after cleanup");
  }
}

async function getValidGeminiResponse(prompt: string, maxRetries = 3): Promise<any> {
  let retries = 0;
  let lastError = null;

  Logger.info('Starting Gemini request', { promptLength: prompt.length, maxRetries });

  while (retries < maxRetries) {
    try {
      Logger.info(`Attempt ${retries + 1} to get Gemini response`);
      
      const { text: analysis } = await generateText({
        model: google("gemini-1.5-pro"),
        prompt: prompt,
      });

      Logger.info('Received response from Gemini', { responseLength: analysis.length });
      
      const cleaned = cleanGeminiResponse(analysis);
      const parsed = JSON.parse(cleaned);
      
      Logger.info('Successfully parsed Gemini response');
      return parsed;
    } catch (error) {
      lastError = error;
      retries++;
      
      Logger.warn(`Gemini request attempt ${retries} failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        retriesLeft: maxRetries - retries
      });
      
      if (retries < maxRetries) {
        const delay = 500 * retries;
        Logger.debug(`Waiting ${delay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  Logger.error('All Gemini request attempts failed', { lastError });
  throw lastError || new Error("Failed to get valid response from Gemini after retries");
}

export async function POST(request: Request) {
  const startTime = Date.now();
  Logger.info('Starting POST request processing');
  
  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File;
    const userid = formData.get("userid") as string;
    const jobDescription = formData.get("jobDescription") as string;

    Logger.debug('Received form data', {
      fileName: file?.name,
      userid: userid,
      jobDescriptionLength: jobDescription?.length
    });

    const validationError = validateFile(file);
    if (validationError) {
      Logger.error('File validation failed', { validationError });
      return NextResponse.json({ success: false, error: validationError }, { status: 400 });
    }

    const resumeText = (await extractTextFromFile(file)).trim();

    if (!resumeText) {
      Logger.error('Empty resume text after extraction');
      return NextResponse.json(
        { success: false, error: "Could not extract text from the resume" },
        { status: 400 }
      );
    }

    Logger.info('Building Gemini prompt');
    const prompt = buildGeminiPrompt(resumeText, jobDescription);
    
    Logger.info('Getting Gemini response');
    const parsedAnalysis = await getValidGeminiResponse(prompt);

    const resumeData = {
      userid,
      createdAt: new Date().toISOString(),
      oldResumeText: resumeText,
      analysis: parsedAnalysis,
      jobDescription: jobDescription,
      id: "",
    };

    Logger.info('Saving resume data to Firebase');
    const resumeRef = await db.collection("resumes").add(resumeData);
    await resumeRef.update({ resumeId: resumeRef.id });
    
    Logger.info('Successfully saved resume analysis', { 
      resumeId: resumeRef.id,
      durationMs: Date.now() - startTime
    });

    return NextResponse.json({ 
      success: true, 
      analysis: parsedAnalysis, 
      id: resumeRef.id 
    }, { status: 200 });
    
  } catch (error) {
    Logger.error('Error processing resume', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
      durationMs: Date.now() - startTime
    });
    
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
  Logger.info('Health check endpoint called');
  return Response.json({ 
    success: true, 
    data: "Resume analytics is operational" 
  }, { status: 200 });
}