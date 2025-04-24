"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getUserInterviewStats(userId: string) {
  const interviewsSnapshot = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .get();

  const interviews = interviewsSnapshot.docs.map((doc) => doc.data());

  if (interviews.length === 0) return null;

  const feedbacksSnapshot = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();

  const feedbacks = feedbacksSnapshot.docs.map((doc) => doc.data());

  // --- Basic Stats ---
  const validScores = feedbacks
    .map((f) => Number(f.totalScore))
    .filter((score) => !isNaN(score));
  
  const averageScore =
    validScores.reduce((acc, curr) => acc + curr, 0) / validScores.length;

  const lastActiveDate = feedbacks
    .map((f) => new Date(f.createdAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const lastActive = lastActiveDate?.toISOString() || null;

  // --- Tech Frequency ---
  const techFrequency: Record<string, number> = {};
  interviews.forEach((i) => {
    i.techstack?.forEach((tech: string) => {
      techFrequency[tech] = (techFrequency[tech] || 0) + 1;
    });
  });

  const favoriteTech =
    Object.entries(techFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || "---";

  // --- Line Chart: Score over Time ---
  const scoreTimeline = feedbacks
    .filter((f) => !isNaN(Number(f.totalScore)))
    .map((f) => ({
      date: new Date(f.createdAt).toISOString().split("T")[0],
      score: Number(f.totalScore),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // --- Bar Chart: Type Frequency ---
  const typeFrequency: Record<string, number> = {};
  interviews.forEach((i) => {
    const type = i.type || "Unknown";
    typeFrequency[type] = (typeFrequency[type] || 0) + 1;
  });

  const interviewTypes = Object.entries(typeFrequency).map(([type, count]) => ({
    type,
    count,
  }));

  // --- Donut Chart: Tech Frequency ---
  const techDonutData = Object.entries(techFrequency).map(([tech, count]) => ({
    tech,
    value: count,
  }));

  return {
    interviewsTaken: interviews.length,
    averageScore: Math.round(averageScore) || 0,
    favoriteTech,
    lastActive,
    lineChartData: scoreTimeline,
    barChartData: interviewTypes,
    donutChartData: techDonutData,
  };
}

type ResumeFeedback = {
  atsScore: number;
  matched: string[];
  missing: string[];
  strengths: string[];
  suggestions: string[];
  weaknesses: string[];
  id: string;
  createdAt: string;
};

export async function getResumeFeedbackById({
  resumeId,
  userId,
}: {
  resumeId: string;
  userId: string;
}): Promise<ResumeFeedback | null> {
  const snapshot = await db
    .collection("resumes")
    .where("resumeId", "==", resumeId)
    .where("userid", "==", userId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();
  
  return {
    atsScore: data.analysis.atsScore ?? 0,
    matched: data.analysis.keywordAnalysis.matched ?? [],
    missing: data.analysis.keywordAnalysis.missing ?? [],
    strengths: data.analysis.strengths ?? [],
    suggestions: data.analysis.suggestions ?? [],
    weaknesses: data.analysis.weaknesses ?? [],
    id: doc.id,
    createdAt: data.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
  };
}

