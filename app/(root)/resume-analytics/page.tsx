"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { FileText, UploadCloud, ScrollText, CheckCircle, XCircle, Bot } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorLoading } from "@/components/ErrorLoading";

// Chat-style typing simulation steps
const typingSteps = [
  "Scanning your resume layout...",
  "Evaluating keyword relevance...",
  "Aligning skills with target roles...",
  "Assessing ATS compatibility score...",
  "Compiling your personalized feedback...",
  "Almost there, hang tight..."
];

export default function ResumeAnalytics() {
  const router = useRouter();
  
  const [uploaded, setUploaded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [showTypingUI, setShowTypingUI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset previous state
    setFileName(null);
    setFile(null);
    setUploaded(true);

    // Check file type
    const isDocx = selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (!isDocx) {
      toast.error("Only DOCX files are supported.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB.");
      return;
    }

    setFileName(selectedFile.name);
    setFile(selectedFile);
  };

  const simulateTyping = async () => {
    setShowTypingUI(true);
    for (let i = 0; i < typingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1300));
      setTypingIndex(i + 1);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
  
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
  
    try {
      setLoading(true);
      
      await simulateTyping();
      const user = await getCurrentUser();
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);
      if (user?.id) {
        formData.append("userid", user.id);
      }
  
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        toast.error("Failed");
        setError(result.error instanceof Error ? result.error.message : 'Failed to load resume');
        throw new Error(result.error || "Analysis failed");
      }
  
      toast.success("Analysis completed successfully!");
      
      // Redirect to feedback page using ID from response
      if (result.id) {
        router.push(`/resume-analytics/${result.id}/feedback`);
      } else {
        throw new Error("No resume ID returned");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong during analysis!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ErrorLoading message={"Error Analyzing Resume"} error={error}/>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 py-10 space-y-10"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
          Resume Analytics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Brew Confidence. Ace Interviews.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!showTypingUI ? (
          <motion.div
            key="upload-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Upload & JD Section */}
            <div className="grid grid-cols-1 gap-6 items-start">
              {/* Resume Upload */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 text-center transition-all"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="text-blue-500 dark:text-blue-400 size-6" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drag & drop your resume here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Accepted format: DOCX (Max 10MB)
                </p>

                {/* File upload status */}
                {fileName && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="size-4 text-blue-500" />
                      <span className="truncate text-sm text-gray-800 dark:text-gray-200">
                        {fileName}
                      </span>
                    </div>
                    <CheckCircle className="size-4 text-green-500" />
                  </motion.div>
                )}

                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-md transition-all ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FileText className="size-4" /> 
                  {fileName ? "Change File" : "Upload Resume"}
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

              {/* Job Description Input */}
              <motion.div
                whileHover={{ y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8 text-center transition-all"
              >
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScrollText className="text-purple-500 dark:text-purple-400 size-6" />
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Mention the role you are aiming for or Paste Job Description
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  We'll tailor your results to this role.
                </p>
                <Textarea
                  placeholder="Mention the role or paste the job description here..."
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg resize-none h-40 focus:ring-2 focus:ring-blue-500"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </motion.div>
            </div>

            {/* Analyze Button */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <Button
                onClick={handleAnalyze}
                disabled={loading || !file || !jobDescription.trim()}
                className="relative overflow-hidden px-8 py-4 text-lg font-medium rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin size-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Now"
                )}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          // Typing UI
          <motion.div
            key="typing-ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg justify-center items-center text-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Bot className="size-5 text-blue-500 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mockhiato AI is analyzing...
              </h2>
            </motion.div>
            
            <div className="space-y-3">
              {typingSteps.slice(0, typingIndex).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-fit max-w-full"
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-500/10 p-1 rounded-full mt-0.5">
                      <Bot className="size-3 text-blue-500" />
                    </div>
                    <span className="inline-block animate-pulse">{msg}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}