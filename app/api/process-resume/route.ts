import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
  const { resumeText, userid, company = "Mockhiato" } = await request.json();

  if (!resumeText || !userid) {
    return Response.json({ success: false, error: "Missing resume text or user ID" }, { status: 400 });
  }

  try {
    // Step 1: Extract info from resume
    const { text: extracted } = await generateText({
      model: google("gemini-1.5-pro"),
      prompt: `Extract the following information from the resume text below:
- Job Role or Title
- Experience Level (e.g., Intern, Junior, Mid-Level, Senior, Lead, etc.)
- Relevant Tech Stack (comma-separated list of tools, languages, or frameworks)

Resume:
"""
${resumeText}
"""

Return the result as valid JSON:
{
  "role": "string",
  "level": "string",
  "techstack": "comma, separated, list"
}

DO NOT include any extra text or formatting.`,
    });

    console.log("Extracted :",extracted);

    const cleaned = extracted
      .replace(/^```json/gm, "")
      .replace(/^```/gm, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const role = parsed.role || "Software Engineer";
    const level = parsed.level || "Mid-Level";
    const techstack = parsed.techstack || "JavaScript, React, Node.js";
    const type = "Mixed";
    const amount = 4;

    // Step 2: Generate questions using same logic as your other API
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Make use of this resume text and extract any projects made or experience to generate majority of the questions: ${resumeText}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3`,
    });

    // Step 3: Store in Firestore
    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()),
      questions: JSON.parse(questions),
      userId: userid,
      company,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true, interview }, { status: 200 });

  } catch (error) {
    console.error("Error processing resume:", error);
    return Response.json({ success: false, error: error?.toString() || "Unknown error" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Resume processing service is operational" }, { status: 200 });
}
