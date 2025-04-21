"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { FileText, UploadCloud, ScrollText, CheckCircle, XCircle, Bot } from "lucide-react";
import { useRouter } from "next/navigation";

// Chat-style typing simulation steps
const typingSteps = [
  "Analyzing resume structure...",
  "Checking keyword density...",
  "Matching skills with job description...",
  "Estimating ATS compatibility...",
  "Finalizing feedback..."
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

  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset previous state
    setFileName(null);
    setFile(null);
    setUploaded(true);
    setAnalysisResult(null);

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

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 space-y-10 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary-200">Resume Analytics</h1>
        <p className="text-lg text-muted-foreground">Brew Confidence. Ace Interviews.</p>
      </div>
      {!showTypingUI ? (
        <>
      {/* Upload & JD Section */}
      <div className="grid grid-cols-1 gap-6 items-start">
        {/* Resume Upload */}
        <div className="relative bg-dark-200 rounded-2xl border border-dark-400 shadow-lg p-10 text-center transition-transform hover:scale-105 duration-300">
          <UploadCloud className="mx-auto text-primary-200 size-14 mb-4 animate-bounce" />
          <p className="text-lg font-medium text-primary-100 mb-2">Drag & drop your resume here</p>
          <p className="text-sm text-muted-foreground mb-4">Accepted format: DOCX (Max 10MB)</p>

          {/* File upload status */}
          {fileName && (
            <div className="mb-4 p-3 bg-dark-700 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="size-4 text-blue-400" />
                <span className="truncate text-sm">{fileName}</span>
              </div>
              {uploaded ? (
                <CheckCircle className="size-4 text-green-500" />
              ) : loading ? (
                <div className="animate-spin size-4 border-2 border-primary-200 border-t-transparent rounded-full"></div>
              ) : (
                <CheckCircle className="size-4 text-green-500" />
              )}
            </div>
          )}

          <label
            htmlFor="resume-upload"
            className={`cursor-pointer inline-flex items-center gap-2 bg-primary-200 text-black px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary-100 transition ${
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
        </div>

        {/* Job Description Input */}
        <div className="relative bg-dark-200 rounded-2xl border border-dark-400 shadow-lg p-10 text-center transition-transform hover:scale-105 duration-300">
          <ScrollText className="mx-auto text-primary-200 size-12 mb-4 animate-pulse" />
          <h2 className="text-lg font-medium text-primary-100 mb-2">Mention the role you are aiming for or Paste Job Description</h2>
          <p className="text-sm text-muted-foreground mb-4">We'll tailor your results to this role.</p>
          <Textarea
            placeholder="Mention the role or paste the job description here..."
            className="bg-dark-700 text-white border border-dark-500 rounded-xl resize-none h-40"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <Button
          className="btn-primary px-6 py-3 text-lg animate-in fade-in zoom-in-75 duration-300"
          onClick={handleAnalyze}
          disabled={loading || !file || !jobDescription.trim()}
        >
          {loading ? "Analyzing..." : "Analyze Now"}
        </Button>
      </div>
      </>
      ): (
        // Typing UI
        <div className="space-y-4 p-6 bg-dark-200 rounded-xl border border-dark-400 shadow-lg">
          <h2 className="text-xl font-semibold text-primary-100 flex items-center gap-2">
            <Bot className="size-5 text-blue-400" />
            Mockhiato AI is analyzing...
          </h2>
          <div className="space-y-3">
            {typingSteps.slice(0, typingIndex).map((msg, idx) => (
              <div
              key={idx}
              className="bg-dark-700 text-white p-3 rounded-lg shadow-sm border border-dark-500 w-fit animate-fade-in transition-all duration-300"
            >
              <span className="inline-block animate-pulse">{msg}</span>
            </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}