"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getResumeFeedbackById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";


const COLORS = ["#00C49F", "#FF8042"];
const CONFETTI_THRESHOLD = 70;

type Feedback = {
  atsScore: number;
  matched: string[];
  missing: string[];
  strengths: string[];
  suggestions: string[];
  weaknesses: string[];
};

export default function FeedbackPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Feedback | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const user = await getCurrentUser();
      if (!user) {
        console.error("User is not authenticated.");
        setLoading(false);
        return;
      }

      const feedback = await getResumeFeedbackById({
        resumeId: Array.isArray(id) ? id[0] : id,
        userId: user.id,
      });

      if (feedback) {
        const completeFeedback: Feedback = {
          atsScore: feedback.atsScore || 0,
          matched: feedback.matched || [],
          missing: feedback.missing || [],
          strengths: feedback.strengths || [],
          suggestions: feedback.suggestions || [],
          weaknesses: feedback.weaknesses || [],
        };
        setData(completeFeedback);

        if (completeFeedback.atsScore > CONFETTI_THRESHOLD && !confettiFired) {
          fireConfetti();
          setConfettiFired(true);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
    });
  };
  

  if (loading || !data) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse grid gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const { atsScore, matched, missing, strengths, suggestions, weaknesses } =
    data;

  const keywordChart = [
    { name: "Matched", value: matched.length },
    { name: "Missing", value: missing.length },
  ];

  const shareUrl = encodeURIComponent(window.location.href);
  const text = encodeURIComponent("Check out my resume feedback!");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10" ref={feedbackRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary-200 mb-2">
          Resume Feedback
        </h1>
        <p className="text-muted-foreground text-lg">
          Here’s a detailed analysis of your resume.
        </p>
      </motion.div>

      {/* ATS Score */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-dark-200 border border-dark-400 rounded-2xl w-full max-w-md">
          <CardContent className="p-6 text-center relative">
            <div className="relative h-40 w-40 mx-auto mb-4">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#444"
                  strokeWidth="2"
                />
                <motion.path
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#00C49F"
                  strokeWidth="2"
                  strokeDasharray={`${atsScore}, 100`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${atsScore}, 100` }}
                  transition={{ duration: 1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-primary-200">
                {atsScore}%
              </div>
            </div>
            <h2 className="text-xl font-semibold">ATS Score</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Indicates how well your resume aligns with the job description.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Keyword Match Pie */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-dark-200 border border-dark-400 rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Keyword Match Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={keywordChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {keywordChart.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Keywords */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-green-950 border border-green-700 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-green-400 mb-4">
              Matched Keywords
            </h3>
            <ul className="list-disc list-inside text-green-300 space-y-1">
              {matched.map((kw, idx) => (
                <li key={idx}>{kw}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-950 border border-red-700 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-red-400 mb-4">
              Missing Keywords
            </h3>
            <ul className="list-disc list-inside text-red-300 space-y-1">
              {missing.map((kw, idx) => (
                <li key={idx}>{kw}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Strengths & Weaknesses and Suggestions */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-6">
          <Card className="bg-dark-200 border border-dark-400 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-green-300 mb-4">
                Strengths
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white text-sm">
                {strengths.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-dark-200 border border-dark-400 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-red-300 mb-4">
                Weaknesses
              </h3>
              <ul className="list-disc list-inside space-y-2 text-white text-sm">
                {weaknesses.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-dark-200 border border-dark-400 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4">
              Suggestions
            </h3>
            <ul className="list-disc list-inside space-y-2 text-white text-sm">
              {suggestions.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}