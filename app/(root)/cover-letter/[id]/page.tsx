"use client";

import { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { fetchCoverLetterData } from '@/lib/actions/general.action';
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import { toast } from "sonner";
import { ErrorLoading } from '@/components/ErrorLoading';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

interface CoverLetterData {
  oldResumeText?: string;
  jobDescription?: string;
  htmlCoverLetter?: string;
}

export default function BuildCoverLetterPage() {
  const { id } = useParams();
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await fetchCoverLetterData(id as string);
        setCoverLetterData(data);
      } catch (err) {
        console.error('Error fetching cover letter:', err);
        setError(err instanceof Error ? err.message : 'Failed to load cover letter');
        toast.error('Failed to load enhanced cover letter.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function formatTextWithRegex(text: string): string {
    // Remove ```html at the start (case insensitive, optional whitespace)
    text = text.replace(/^```html\s*/i, "");
  
    // Remove ``` at the end (optional whitespace)
    text = text.replace(/\s*```/, "");
  
    // Replace <h2> with styled version
    text = text.replace(/<h2>/g, '<h2 style="text-align:center; color:#006699; font-weight:bold;">');
  
    // Add new line after each closing </p>
    text = text.replace(/<\/p>/g, '</p>\n');
  
    // Add new line after each <br>
    text = text.replace(/<br\s*\/?>/g, '<hr>');
  
    // Remove <div> and </div> tags
    text = text.replace(/<\/?div>/g, '');
  
    // Trim whitespace
    return text.trim();
  }
  

  const enhancedText = coverLetterData?.htmlCoverLetter ? formatTextWithRegex(coverLetterData.htmlCoverLetter) : '';

  const printCoverLetter = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cover Letter</title>
            <style>
              @page {
                margin: 0;
                size: auto;
              }
              body {
                margin: 20px;
                font-family: 'Georgia', serif;
                line-height: 1.6;
              }
              h2 {
                text-align: center;
                color: #006699;
                font-weight: bold;
              }
              p {
                margin-bottom: 1em;
              }
            </style>
          </head>
          <body>${enhancedText}</body>
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

  function htmlToDocxParagraphs(html: string): Paragraph[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = Array.from(doc.body.childNodes);
    const paragraphs: Paragraph[] = [];

    elements.forEach(node => {
      if (!(node instanceof HTMLElement)) return;
      const text = node.textContent || "";

      switch (node.tagName.toLowerCase()) {
        case "h1":
        case "h2":
        case "h3":
          paragraphs.push(new Paragraph({
            text,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }));
          break;

        case "p":
          paragraphs.push(new Paragraph({ text }));
          break;

        case "br":
          paragraphs.push(new Paragraph({ text: "" }));
          break;

        default:
          paragraphs.push(new Paragraph({ text }));
      }
    });

    return paragraphs;
  }

  const downloadCoverLetter = async () => {
    if (!enhancedText) return;

    const doc = new Document({
      sections: [{ children: htmlToDocxParagraphs(enhancedText) }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.docx";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="mb-4">
            <Skeleton className="h-24 w-full rounded-lg bg-gradient-to-br from-gray-800 to-gray-700" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (error || !coverLetterData) {
    return <ErrorLoading message="Error Loading Cover Letter" error={error || "Unknown error"} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <FadeIn duration={600}>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Your Cover Letter
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Tailored and AI-enhanced</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={printCoverLetter} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button onClick={downloadCoverLetter} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download .docx
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 prose dark:prose-invert prose-p:leading-relaxed prose-h2:text-2xl max-w-none">
        <div dangerouslySetInnerHTML={{ __html: enhancedText }} />
      </div>
    </div>
  );
}
