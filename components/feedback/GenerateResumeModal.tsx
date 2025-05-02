"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";

const analysisSteps = [
  "Scanning resume content...",
  "Analyzing skills and keywords...",
  "Evaluating ATS compatibility...",
  "Optimizing formatting and structure...",
  "Generating recommendations...",
  "Finalizing your analysis..."
];

type GenerateResumeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: () => Promise<{ success: boolean; id?: string; error?: string }>;
  onSuccess: (result: { success: boolean; id?: string }) => void;
};

export function GenerateResumeModal({
  open,
  onOpenChange,
  action,
  onSuccess
}: GenerateResumeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      setTypingIndex(0);
      setProgress(0);
      setError(null);
    }
  }, [open]);

  // Typing animation effect
  useEffect(() => {
    if (open && isProcessing && typingIndex < analysisSteps.length) {
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
        setProgress(Math.min(100, (typingIndex + 1) * (100 / analysisSteps.length)));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [open, isProcessing, typingIndex]);

  const handleAction = async () => {
    setIsProcessing(true);
    setError(null);
    setTypingIndex(0);
    setProgress(0);

    try {
      // Start the typing animation
      setTypingIndex(1);
      setProgress(100 / analysisSteps.length);

      // Run the actual action
      const result = await action();

      if (!result.success) {
        throw new Error(result.error || "Analysis failed");
      }

      // Fast-forward through remaining steps if API completes first
      if (typingIndex < analysisSteps.length) {
        const remainingSteps = analysisSteps.length - typingIndex;
        setTypingIndex(analysisSteps.length);
        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, remainingSteps * 500));
      }

      onSuccess(result);
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left flex items-center gap-2">
            <Bot className="size-5 text-blue-500" />
            Resume Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
              <Bot className="size-5 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {progress < 100 ? "Analyzing your resume..." : "Analysis complete!"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {progress < 100 ? "This may take a moment..." : "Redirecting to your analysis..."}
              </p>
            </div>
          </div>

          {/* Chat-style steps */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {analysisSteps.slice(0, typingIndex).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-1 rounded-full mt-1 ${idx < typingIndex - 1 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                  {idx < typingIndex - 1 ? (
                    <CheckCircle className="size-3 text-green-500 dark:text-green-400" />
                  ) : (
                    <Bot className="size-3 text-blue-500" />
                  )}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{msg}</span>
              </motion.div>
            ))}
          </div>

          {/* Action buttons */}
          {!isProcessing && progress < 100 && (
            <Button
              onClick={handleAction}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start Analysis
            </Button>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="size-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button 
                onClick={() => {
                  setError(null);
                  onOpenChange(false);
                }}
                className="mt-3 w-full"
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}