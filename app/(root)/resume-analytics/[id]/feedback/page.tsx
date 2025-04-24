"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getResumeFeedbackById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiAward } from "react-icons/fi";
import FadeIn from "@/components/FadeIn";

const COLORS = ["#4ade80", "#f87171"];
const CONFETTI_THRESHOLD = 70;

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

  const keywordChart = [
    { name: "Matched", value: matched.length },
    { name: "Missing", value: missing.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12" ref={feedbackRef}>
      <FadeIn duration={200}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeIn}>
            <h1 className="text-4xl text-center md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-3">
              Resume Feedback
            </h1>
          </motion.div>
        </motion.div>
      </FadeIn>

      <FadeIn duration={400}>
        {/* ATS Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex justify-center"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center relative">
              <div className="relative h-48 w-48 mx-auto mb-6">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="3"
                  />
                  <motion.path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${atsScore}, 100`}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${atsScore}, 100` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
                  >
                    {atsScore}%
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-sm text-gray-400 mt-2"
                  >
                    ATS Score
                  </motion.div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-400 text-sm"
              >
                {atsScore > CONFETTI_THRESHOLD ? (
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <FiAward className="text-lg" />
                    <span>Great job! Your resume is well-optimized.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-amber-400">
                    <FiAlertTriangle className="text-lg" />
                    <span>Consider improving these areas for better results.</span>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>

      {/* Keyword Match Pie */}
      <FadeIn duration={600}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                Keyword Match Overview
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={keywordChart}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={60}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        animationBegin={200}
                        animationDuration={1000}
                      >
                        {keywordChart.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} keywords`, name]}
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          borderColor: '#374151',
                          borderRadius: '0.5rem',
                          color: '#f3f4f6'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                    <div>
                      <h3 className="font-medium text-white">Matched Keywords</h3>
                      <p className="text-sm text-gray-400">
                        {matched.length} keywords found in your resume
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-400"></div>
                    <div>
                      <h3 className="font-medium text-white">Missing Keywords</h3>
                      <p className="text-sm text-gray-400">
                        {missing.length} keywords not found in your resume
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>

      {/* Keywords */}
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
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-emerald-500/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiCheckCircle className="text-2xl text-emerald-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Matched Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matched.map((kw, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm border border-emerald-800/50"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-red-500/10 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiAlertTriangle className="text-2xl text-red-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Missing Keywords
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missing.map((kw, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="inline-block px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm border border-red-800/50"
                    >
                      {kw}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </FadeIn>

      {/* Strengths & Weaknesses and Suggestions */}
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
            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-emerald-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiCheckCircle className="text-2xl text-emerald-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Strengths
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {strengths.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-red-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiAlertTriangle className="text-2xl text-red-400" />
                    <h3 className="text-xl font-semibold text-white">
                      Weaknesses
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {weaknesses.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2 text-gray-300"
                      >
                        <span className="text-red-400 mt-1">•</span>
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-blue-500/10 transition-all h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FiInfo className="text-2xl text-blue-400" />
                  <h3 className="text-xl font-semibold text-white">
                    Suggestions
                  </h3>
                </div>
                <ul className="space-y-4">
                  {suggestions.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors"
                    >
                      <span className="text-gray-300">{point}</span>
                      
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </FadeIn>
    </div>
  );
}