"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { FileText, UploadCloud, ScrollText, Bot, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorLoading } from "@/components/ErrorLoading";
import { GenerateResumeModal } from "@/components/feedback/GenerateResumeModal";

export default function ResumeAnalytics() {
  const router = useRouter();
  
  const [uploaded, setUploaded] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
  
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setModalOpen(true);
  };

  const executeAnalysis = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      const formData = new FormData();
      formData.append("resume", file!);
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
        throw new Error(result.error || "Analysis failed");
      }

      return { 
        success: true, 
        id: result.id
      };
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (id: string) => {
    router.push(`/resume-analytics/${id}/feedback`);
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

      <motion.div
        key="upload-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
              We'll tailor your results to this role. Provide the Job description for a good cover letter generation.
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
          className="flex justify-center"
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

      {/* GenerateResumeModal */}
      <GenerateResumeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        action={executeAnalysis}
        onSuccess={(result: { success: boolean; id?: string }) => {
          if (result.success && result.id) {
            handleSuccess(result.id);
          }
        }}
      />
    </motion.section>
  );
}