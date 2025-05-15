"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import {
    AlertTriangle, Calendar, ListChecks, ThumbsUp, Lightbulb, ArrowLeft, Repeat, Award
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import FadeIn from "./FadeIn"; 

const cardVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
};

const CONFETTI_THRESHOLD = 70;

const listItemVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
};

const tagVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
};

const Feedback = ({ feedback, interview, paramID }: any) => {
    return (
        <motion.section
            className="section-feedback px-6 py-10 max-w-4xl mx-auto flex flex-col items-center space-y-6"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.1 }}
        >
            <FadeIn duration={200}> {/* Added duration */}
                <motion.div
                    className="text-center mb-6"
                    variants={cardVariants}
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
                        Feedback on <span className="capitalize">{interview.role}</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Received on {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D,YYYY h:mm A") : "N/A"}
                    </p>
                </motion.div>
            </FadeIn>

            <FadeIn duration={400}> {/* Added duration */}
                <motion.div className="relative flex flex-col items-center mb-8" variants={cardVariants}>
                    {/* Overall Impression Card (Bigger) */}
                    <motion.div key="overall-impression" variants={cardVariants}>
                        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-96 p-8 text-center relative">
                            <CardContent className="p-12 relative">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-lg font-semibold text-white mt-2"
                                >
                                    Overall Impression
                                </motion.div>
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
                                            strokeDasharray={`${feedback?.totalScore || 0}, 100`}
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0, 100" }}
                                            animate={{ strokeDasharray: `${feedback?.totalScore || 0}, 100` }}
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
                                            {feedback?.totalScore}%
                                        </motion.div>
                                    </div>
                                </div>
                                {feedback?.totalScore > CONFETTI_THRESHOLD && (
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 mt-4">
                                        <Award className="text-xl" />
                                        <span>You killed it!</span>
                                    </div>
                                )}
                                {feedback?.totalScore <= CONFETTI_THRESHOLD && (
                                    <div className="flex items-center justify-center gap-2 text-amber-400 mt-4">
                                        <AlertTriangle className="text-xl" />
                                        <span>Use the feedback to improve.</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Interview Date Card */}
                    <motion.div
                        key="interview-date"
                        variants={cardVariants}
                        className="
                            absolute 
                            bottom-0 
                            left-1/2 
                            -translate-x-1/2 
                            md:left-auto 
                            md:right-0 
                            md:translate-x-12 
                            w-[33.33%] 
                            min-w-[100px] 
                            max-w-[150px]
                            md:translate-y-6 
                            translate-y-[110%]
                        "
                    >
                        <Card className="bg-indigo-700 text-white border-indigo-600 rounded-md shadow-md p-0">
                            <CardContent className="px-1 py-1 text-center">
                                <Calendar className="text-indigo-200 w-4 h-4 mx-auto" />
                                <h3 className="text-[10px] md:text-xs font-semibold text-indigo-200 leading-tight">Interview</h3>
                                <p className="text-xs md:text-sm font-bold text-indigo-100 leading-none">
                                    {dayjs(feedback?.createdAt).format("MMM D, YYYY") || "N/A"}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </FadeIn>

            <FadeIn duration={600}> {/* Added duration */}
                <motion.div
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 mb-8"
                    variants={cardVariants}
                >
                    <h2 className="text-2xl font-semibold text-white mb-3">Final Assessment</h2>
                    <p className="text-gray-300">{feedback?.finalAssessment || "No final assessment provided."}</p>
                </motion.div>
            </FadeIn>

            <FadeIn duration={800}> {/* Added duration */}
                <motion.div className="mb-8" variants={cardVariants}>
                    <h2 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                        <ListChecks className="text-gray-400 w-5 h-5" />
                        <span>Interview Breakdown</span>
                    </h2>
                    <div className="space-y-4">
                        {feedback?.categoryScores?.map((category, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
                                variants={listItemVariants}
                            >
                                <p className="font-semibold text-white mb-1">
                                    {index + 1}. {category.name} — <span className="text-blue-400">{category.score}/100</span>
                                </p>
                                <p className="text-gray-400">{category.comment || "No comment provided."}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </FadeIn>

            <FadeIn duration={1000}> {/* Added duration */}
                <motion.div className="mb-6" variants={cardVariants}>
                    <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center space-x-2">
                        <ThumbsUp className="text-emerald-400 w-5 h-5" />
                        <span>Strengths</span>
                    </h3>
                    {feedback?.strengths?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {feedback.strengths.map((item: string, idx: number) => (
                                <motion.span
                                    key={idx}
                                    className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm border border-emerald-800/50"
                                    variants={{ ...listItemVariants, ...tagVariants }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No strengths mentioned.</p>
                    )}
                </motion.div>
            </FadeIn>

            <FadeIn duration={1200}> {/* Added duration */}
                <motion.div className="mb-10" variants={cardVariants}>
                    <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center space-x-2">
                        <Lightbulb className="text-amber-400 w-5 h-5" />
                        <span>Areas for Improvement</span>
                    </h3>
                    {feedback?.areasForImprovement?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {feedback.areasForImprovement.map((item: string, idx: number) => (
                                <motion.span
                                    key={idx}
                                    className="inline-block px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm border border-amber-800/50"
                                    variants={{ ...listItemVariants, ...tagVariants }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    {item}
                                </motion.span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No areas for improvement mentioned.</p>
                    )}
                </motion.div>
            </FadeIn>

            <FadeIn duration={1400}> {/* Added duration */}
                <motion.div className="flex gap-10" variants={cardVariants}>
                    <Button asChild className="flex-1 px-2 py-6 bg-gray-800/50 border border-gray-700 text-blue-400 hover:bg-gray-700">
                        <Link href="/" className="flex justify-center items-center space-x-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Back to Dashboard</span>
                        </Link>
                    </Button>
                    <Button asChild className="flex-1 px-2 py-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white">
                        <Link
                            href={`/interview/${paramID}`}
                            className="flex justify-center items-center space-x-2"
                        >
                            <Repeat className="w-4 h-4" />
                            <span className="text-sm font-medium">Retake Interview</span>
                        </Link>
                    </Button>
                </motion.div>
            </FadeIn>
        </motion.section>
    );
};

export default Feedback;