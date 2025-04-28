"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {  getResumeFeedbackById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FadeIn from "@/components/FadeIn";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import ScoreCard from "@/components/feedback/ScoreCard";
import KeywordMatchChart from "@/components/feedback/KeywordMatchChart";
import KeywordList from "@/components/feedback/KeywordList";
import FeedbackSection from "@/components/feedback/FeedbackSection";
import GenerateResumeCard from "@/components/feedback/GenerateResumeCard";
import { toast } from "sonner";

const CONFETTI_THRESHOLD = 69;

type Feedback = {
  atsScore: number;
  matched: string[];
  missing: string[];
  strengths: string[];
  suggestions: string[];
  weaknesses: string[];
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FeedbackPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Feedback | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [confettiFired, setConfettiFired] = useState(false);
  const [generating, setGenerating] = useState(false);

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
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#60a5fa', '#fbbf24', '#f87171'],
    });
  };

  if (loading || !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton className="h-64 w-full rounded-xl bg-gradient-to-br from-gray-800 to-gray-700" />
          </motion.div>
        ))}
      </div>
    );
  }

  const { atsScore, matched, missing, strengths, suggestions, weaknesses } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12" ref={feedbackRef}>
      <FeedbackHeader />

      <ScoreCard score={atsScore} threshold={CONFETTI_THRESHOLD} />

      <KeywordMatchChart matched={matched.length} missing={missing.length} />

      <FadeIn duration={800}>
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          <KeywordList type="matched" keywords={matched} />
          <KeywordList type="missing" keywords={missing} />
        </motion.div>
      </FadeIn>

      <FadeIn duration={1000}>
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.4
              }
            }
          }}
        >
          <div className="grid gap-6">
            <FeedbackSection type="strengths" items={strengths} />
            <FeedbackSection type="weaknesses" items={weaknesses} />
          </div>
          <FeedbackSection type="suggestions" items={suggestions} />
        </motion.div>
      </FadeIn>

      {id && typeof id === "string" && (
        <GenerateResumeCard resumeId={id} />
      )}

    </div>
  );
}