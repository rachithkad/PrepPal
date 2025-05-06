import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
import { Logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  Logger.info('Starting interview questions generation request');

  try {
    const requestData = await request.json();
    const { resumeText, userid, jobDescription } = requestData;

    Logger.debug('Received request data', {
      resumeTextLength: resumeText?.length,
      userid,
      jobDescriptionLength: jobDescription?.length
    });

    if (!resumeText || !userid) {
      Logger.error('Missing required fields', {
        missingFields: [
          !resumeText ? 'resumeText' : '',
          !userid ? 'userid' : ''
        ].filter(Boolean)
      });
      return Response.json(
        { success: false, error: "Missing resume text or user ID" }, 
        { status: 400 }
      );
    }

    // Step 1: Extract info from resume
    Logger.info('Extracting information from resume');
    const extractPrompt = `Extract the following information from the resume text below:
- Job Role or Title
- Experience Level (e.g., Intern, Junior, Mid-Level, Senior, Lead, etc.)
- Relevant Tech Stack (comma-separated list of tools, languages, or frameworks)
- Infer the company from the Job Description only not from the resume.

Resume:
"""
${resumeText}
"""

Job Description:
"""
${jobDescription}
"""

Return the result as valid JSON:
{
  "role": "string",
  "level": "string",
  "techstack": "comma, separated, list",
  "company": "string"
}

DO NOT include any extra text or formatting.`; 

    const { text: extracted } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: extractPrompt,
    });

    Logger.debug('Received extraction response', {
      responseLength: extracted.length
    });

    const cleaned = extracted
      .replace(/^```json/gm, "")
      .replace(/^```/gm, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
      Logger.info('Successfully parsed extracted information', {
        extractedData: parsed
      });
    } catch (parseError) {
      Logger.error('Failed to parse extracted information', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        cleanedResponse: cleaned
      });
      throw new Error("Failed to parse extracted information");
    }

    const role = parsed.role || "Software Engineer";
    const level = parsed.level || "Mid-Level";
    const techstack = parsed.techstack || "JavaScript, React, Node.js";
    const company = parsed.company || "Mockhiato";
    const type = "Mixed";
    const amount = 4;

    Logger.info('Determined interview parameters', {
      role,
      level,
      techstack,
      company,
      type,
      amount
    });

    // Step 2: Generate questions
    Logger.info('Generating interview questions');
    const questionPrompt = jobDescription 
      ? `Prepare questions for a job interview based on both the candidate's resume and the job description.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        
        Here's the candidate's resume text:
        ${resumeText}
        
        Here's the job description:
        ${jobDescription}
        
        Generate questions that:
        1. Assess the candidate's fit based on their resume
        2. Evaluate their qualifications for the specific job requirements
        3. Cover both technical and behavioral aspects
        4. Would be asked if the candidate were to interview for the ${role} role at the ${company} company/organisation
        
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]`
      : `Prepare questions for a job interview based on the candidate's resume.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Make use of this resume text and extract any projects made or experience to generate majority of the questions: ${resumeText}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]`;

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: questionPrompt,
    });

    Logger.debug('Received questions response', {
      responseLength: questions.length
    });

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(questions);
      Logger.info('Successfully parsed generated questions', {
        questionCount: parsedQuestions.length
      });
    } catch (parseError) {
      Logger.error('Failed to parse generated questions', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        questionsResponse: questions
      });
      throw new Error("Failed to parse generated questions");
    }

    // Step 3: Store in Firestore
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions: parsedQuestions,
      userId: userid,
      company,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      ...(jobDescription && { jobDescription }), 
    };

    Logger.info('Saving interview to Firestore');
    await db.collection("interviews").add(interview);
    Logger.info('Successfully saved interview data');

    Logger.info('Successfully completed interview generation', {
      durationMs: Date.now() - startTime
    });

    return Response.json({ 
      success: true, 
      interview,
      extracted: {
        role,
        level,
        techstack
      }
    }, { status: 200 });

  } catch (error) {
    Logger.error('Error processing interview generation', {
      error: error instanceof Error ? {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : 'Unknown error',
      durationMs: Date.now() - startTime
    });

    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  Logger.info('Health check endpoint called');
  return Response.json(
    { 
      success: true, 
      data: "Resume processing service is operational" 
    }, 
    { status: 200 }
  );
}