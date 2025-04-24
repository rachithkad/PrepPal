"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as mammoth from "mammoth";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ResumeUploadPage = () => {
  const [parsedText, setParsedText] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<{ role: string; level: string; techstack: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      toast.error("Only DOCX files are supported.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      e.target.value = "";
      return;
    }

    try {
      setLoading(true);
      const user = await getCurrentUser();
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const textContent = result.value;

      setParsedText(textContent);

      const res = await fetch("/api/process-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: textContent, userid: user?.id }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Questions generated!");
        setQuestions(data.questions);
        setExtracted(data.extracted);

        if (isClient) {
          router.push("/");
        }
      } else {
        toast.error("Failed to generate questions.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 mb-4">
          Upload Your Resume
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          We'll analyze your resume and create a personalized mock interview.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 sm:p-10 text-center"
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <UploadCloud className="text-blue-500 dark:text-blue-400 size-8 animate-bounce" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Drag & drop your resume here
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Accepted format: DOCX (Max 10MB)
        </p>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <label
            htmlFor="resume-upload"
            className={`cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-md transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FileText className="size-5" /> 
            {loading ? "Processing..." : "Upload Resume"}
          </label>
          <input
            type="file"
            id="resume-upload"
            accept=".docx"
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Analyzing your resume...
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link href="/generate/form">
            <Button variant="outline" className="group">
              <span className="flex items-center gap-1">
                Skip & Fill Form
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default ResumeUploadPage;