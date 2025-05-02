import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

function generateCoverLetter(resumeText: string, jobDescription: string = ""): string {
  
  return `Role:
You are a professional cover letter writer with expertise in personalized job applications and alignment with job descriptions. Your task is to create a compelling, customized cover letter that aligns the candidate's qualifications with the target role, using the provided resume and job description.
"""
${resumeText}
"""

Job Description:
"""
${jobDescription || "No job description provided"}
"""

Instructions:
1. Generate a personalized and professional cover letter that meets the following criteria without requiring any manual edits from the user:
2. Automatically extract and reference the job title, company name, and skills from the job description.
3. Assume the job was found through a relevant platform (e.g., LinkedIn, company site, or job board) based on context—do not leave placeholders.
4. Show clear alignment between the candidate's background and the role's requirements.
5. Incorporate relevant keywords and technologies naturally to optimize for ATS.
6. Highlight the most impressive and measurable accomplishments from the resume.
7. Maintain a professional tone that is confident, clear, and enthusiastic.
8. Avoid generic phrases and ensure every sentence adds value.
9. Use strong action verbs and formal grammar throughout.
10. Keep the letter within one page (~300-400 words).

Ensure the letter flows logically with proper paragraphing and transitions.

Format the cover letter with the following structure:Format the cover letter using valid and semantic HTML, with the following structure:
Use <div> as the outer container
Use <h2> for the candidate name
Use <p> tags for each paragraph
Include line breaks where appropriate using <br>
Format contact information using <ul><li> or <p>
Use <strong> for any emphasis or section labels
Keep styling minimal (no CSS) — structure only, not appearance

Sections to include in the HTML:

Header: Candidate name and contact info (email, phone, LinkedIn—optional)
Salutation: Address the hiring manager by name if known; otherwise, use “Dear Hiring Manager”
Introduction (Paragraph 1):
Mention the job title and how you found the listing
Express genuine interest in the company and role
Body (Paragraphs 2-3):
Match qualifications to job requirements
Provide specific examples of relevant accomplishments (quantified if possible)
Emphasize unique strengths or traits that make the candidate a great fit
Conclusion (Paragraph 4):
Reiterate interest and enthusiasm
Include a call to action and mention openness to an interview
Signature:
Full name
Optional: LinkedIn URL or other relevant links

Return ONLY the cover letter as valid, semantic HTML.
Do NOT include explanations, analysis, or Markdown.
Ensure correct use of tags and proper paragraph breaks for readability in web display.
`;
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

    const resumeData = resumeDoc.data() as {
      oldResumeText: string;
      jobDescription?: string;
      htmlCoverLetter?: string;
    };

    // Return cached cover letter if exists
    if (resumeData.htmlCoverLetter) {
      console.log("Returning existing cover letter");
      return NextResponse.json(
        {
          success: true,
          htmlCoverLetter: resumeData.htmlCoverLetter,
          fromCache: true,
        },
        { status: 200 }
      );
    }

    if (!resumeData.oldResumeText) {
      return NextResponse.json(
        { success: false, error: "Resume text missing in database." },
        { status: 400 }
      );
    }

    // Build text prompt for cover letter
    const coverLetterPrompt = generateCoverLetter(resumeData.oldResumeText, resumeData.jobDescription )

    const { text: htmlCoverLetter } = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt: coverLetterPrompt,
      maxTokens: 3000,
      temperature: 0.3,
    });

    // Save generated cover letter
    await db.collection("resumes").doc(resumeId).update({
      htmlCoverLetter,
      coverLetterGeneratedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        htmlCoverLetter,
        fromCache: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cover letter generation error:", error);

    if (resumeId) {
      try {
        await db.collection("resumes").doc(resumeId).update({
          coverLetterFailed: true,
          coverLetterGeneratedAt: new Date().toISOString(),
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


export async function GET() {
  return NextResponse.json(
    { success: true, message: "Cover letter Generation service is operational" },
    { status: 200 }
  );
}