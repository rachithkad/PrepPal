"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as mammoth from "mammoth";
import Link from "next/link";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation"; // Updated to use next/navigation

const ResumeUploadPage = () => {
  const [parsedText, setParsedText] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<{ role: string; level: string; techstack: string } | null>(null);
  const [isClient, setIsClient] = useState(false); // Add state to track client-side rendering

  const router = useRouter(); // useRouter for client-side navigation

  useEffect(() => {
    // This will ensure router works only on the client side
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

      // Send to backend
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
          // Now router.push will work as expected
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
    <section className="max-w-3xl mx-auto py-10 px-6 overflow-y-hidden">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-200">Upload Your Resume</h1>
        <p className="text-muted-foreground mt-2 text-base">
          We'll analyze your resume and create a personalized mock interview.
        </p>
      </div>

      <div className="relative bg-dark-200 rounded-2xl border border-dark-400 shadow-lg p-10 text-center">
        <UploadCloud className="mx-auto text-primary-200 size-14 mb-4 animate-bounce" />
        <p className="text-lg font-medium text-primary-100 mb-2">Drag & drop your resume here</p>
        <p className="text-sm text-muted-foreground mb-4">Accepted format: DOCX (Max 10MB)</p>

        <label
          htmlFor="resume-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-primary-200 text-black px-6 py-2 rounded-xl text-sm font-semibold hover:bg-primary-100 transition"
        >
          <FileText className="size-4" /> Upload Resume
        </label>
        <input
          type="file"
          id="resume-upload"
          accept=".docx"
          className="hidden"
          onChange={handleFileChange}
        />

        {loading && <p className="mt-4 text-sm text-muted-foreground animate-pulse">Analyzing resume...</p>}

        <div className="mt-6">
          <Link href="/generate/form">
            <Button variant="outline" className="text-sm">Skip & Fill Form</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ResumeUploadPage;
