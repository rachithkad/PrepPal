"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { fetchResumeData } from '@/lib/actions/general.action';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { toast } from "sonner";
import { ErrorLoading } from '@/components/ErrorLoading';
import htmlDocx from 'html-docx-js/dist/html-docx';

interface ResumeData {
  enhancedResumeText: string;
  oldResumeText?: string;
  analysis?: any;
  jobDescription?: string;
  htmlResume?: string;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BuildResumePage() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const data = await fetchResumeData(id);
        setResumeData(data);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError(err instanceof Error ? err.message : 'Failed to load resume');
        toast.error('Failed to load enhanced resume.');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  function formatTextWithRegex(text: string): string {
    // Remove ```html at the start (case insensitive, optional whitespace)
    text = text.replace(/^```html\s*/i, "");
  
    // Remove ``` at the end (optional whitespace)
    text = text.replace(/\s*```$/, "");
  
    // Replace "Situation:", "Task:", "Action:", and "Result:" with nothing
    text = text.replace(/Situation:\s*/g, "");
    text = text.replace(/Task:\s*/g, "");
    text = text.replace(/Action:\s*/g, "");
    text = text.replace(/Result:\s*/g, "");
  
    // Remove "Situation", "Task", "Action", "Result" words alone (case insensitive)
    text = text.replace(/\b(Situation|Task|Action|Result)\b/gi, "");
  
    // Remove double underscores
    text = text.replace(/__/g, "");

    text = text.replace(/<h2>/g, '<h2 style="text-align:center; color:#006699; font-weight:bold;">');
    text = text.replace(/<h3>/g, '<h3 style="color:#006699; text-decoration:underline;">');
  
    return text.trim(); // Also trim whitespace at the start and end
  }

  const enhancedText = resumeData?.htmlResume ? formatTextWithRegex(resumeData.htmlResume) : '';

  const printResume = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;
  
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Enhanced Resume</title>
            <style>
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            ${enhancedText || ''}
          </body>
        </html>
      `);
      printWindow.document.close();
  
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  };

  
  const downloadResume = () => {
    if (!enhancedText) return;
  
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 1in;
            }
            h1, h2, h3 {
              color: #006699;
            }
          </style>
        </head>
        <body>
          ${enhancedText}
        </body>
      </html>
    `;
  
    const docxBlob = htmlDocx.asBlob(html);
    const url = URL.createObjectURL(docxBlob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enhanced_resume.docx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };
  
  

  if (loading || !resumeData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: i * 0.2 }}
            >
              <Skeleton className="h-64 w-full rounded-xl bg-gradient-to-br from-gray-800 to-gray-700" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorLoading message={"Error Loading Resume"} error={error} />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <FadeIn duration={600}>
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
            Your Enhanced Resume
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            AI-optimized and ready to impress
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={printResume}
            variant="outline"
            className="gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button 
            onClick={downloadResume}
            variant="outline"
            className="gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4" />
            Download .docx
          </Button>
        </div>
      </div>

      </FadeIn>

      {/* Resume Content */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div
          id="resume-content"
          className="p-8 sm:p-10 prose prose-indigo dark:prose-invert max-w-none prose-h1:text-5xl"
          dangerouslySetInnerHTML={{ __html: enhancedText || '' }}
        />
      </div>
    </div>
  );
}
