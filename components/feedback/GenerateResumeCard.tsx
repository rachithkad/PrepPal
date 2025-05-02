import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import { Bot, FileText } from "lucide-react"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { postEnhanceResume, postGenerateCoverLetter } from "@/lib/actions/general.action";

const initialTypingSteps = [
  "Scanning content...",
  "Analyzing requirements...",
  "Optimizing structure...",
  "Generating content...",
  "Finalizing document..."
];

type GenerateResumeCardProps = {
  resumeId: string;
};

export default function GenerateResumeCard({ 
  resumeId
}: GenerateResumeCardProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [actionType, setActionType] = useState<'resume' | 'coverLetter'>('resume');

  // Typing animation effect
  useEffect(() => {
    if (openModal && typingIndex < initialTypingSteps.length) {
      const timer = setTimeout(() => {
        setTypingIndex(prev => prev + 1);
        setProgress(Math.min(100, (typingIndex + 1) * (100 / initialTypingSteps.length)));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [openModal, typingIndex]);

  const handleGenerateResume = async () => {
    setActionType('resume');
    setOpenModal(true);
    setTypingIndex(0);
    setProgress(0);
    setIsGeneratingResume(true);
    setError(null);

    try {
      const result = await postEnhanceResume(resumeId);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to enhance resume");
      }

      // Fast-forward through remaining steps if API completes first
      if (typingIndex < initialTypingSteps.length) {
        const remainingSteps = initialTypingSteps.length - typingIndex;
        setTypingIndex(initialTypingSteps.length);
        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, remainingSteps * 500));
      }

      router.push(`/build-resume/${resumeId}`);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsGeneratingResume(false);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setActionType('coverLetter');
    setOpenModal(true);
    setTypingIndex(0);
    setProgress(0);
    setIsGeneratingCoverLetter(true);
    setError(null);

    try {
      const result = await postGenerateCoverLetter(resumeId);
      
      if (!result.success) {
        throw new Error(result.error || "Failed to generate cover letter");
      }

      // Fast-forward through remaining steps if API completes first
      if (typingIndex < initialTypingSteps.length) {
        const remainingSteps = initialTypingSteps.length - typingIndex;
        setTypingIndex(initialTypingSteps.length);
        setProgress(100);
        await new Promise(resolve => setTimeout(resolve, remainingSteps * 500));
      }

      router.push(`/cover-letter/${resumeId}`);
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsGeneratingCoverLetter(false);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const getModalTitle = () => {
    return actionType === 'resume' 
      ? "Resume Enhancement Progress" 
      : "Cover Letter Generation Progress";
  };

  const getStatusMessage = () => {
    if (progress < 100) {
      return actionType === 'resume' 
        ? "Enhancing your resume..." 
        : "Generating your cover letter...";
    }
    return actionType === 'resume' 
      ? "Enhancement complete!" 
      : "Cover letter ready!";
  };

  const getRedirectMessage = () => {
    if (progress < 100) {
      return "This may take a moment...";
    }
    return actionType === 'resume' 
      ? "Redirecting to your enhanced resume..." 
      : "Redirecting to your cover letter...";
  };

  return (
    <>
      {/* Cards Container */}
      <FadeIn duration={1200}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Resume Enhancement Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Generate Enhanced Resume
              </h2>
              <p className="text-gray-400 mb-6">
                Our AI will optimize your resume with all suggested improvements
              </p>
              <Button
                onClick={handleGenerateResume}
                disabled={isGeneratingResume || isGeneratingCoverLetter}
                className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white py-6 px-8 rounded-lg transition-all flex items-center gap-2 w-full"
              >
                {isGeneratingResume ? (
                  <>
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Generating...
                  </>
                ) : (
                  "Generate Resume"
                )}
              </Button>
              <p className="text-gray-500 text-sm mt-4">
                You'll be able to review and download the enhanced version
              </p>
            </CardContent>
          </Card>

          {/* Cover Letter Card */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Generate Cover Letter
              </h2>
              <p className="text-gray-400 mb-6">
                Our AI will create a tailored cover letter for your application
              </p>
              <Button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCoverLetter || isGeneratingResume}
                className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white py-6 px-8 rounded-lg transition-all flex items-center gap-2 w-full"
              >
                {isGeneratingCoverLetter ? (
                  <>
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="size-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
              <p className="text-gray-500 text-sm mt-4">
                Personalized to match your resume and job requirements
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </FadeIn>

      {/* Generation Modal */}
      <Dialog open={openModal} onOpenChange={(open) => !open && !isGeneratingResume && !isGeneratingCoverLetter && setOpenModal(open)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left">
              <VisuallyHidden>{getModalTitle()}</VisuallyHidden>
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-4">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`${actionType === 'resume' ? 'bg-indigo-600' : 'bg-emerald-600'} h-2.5 rounded-full transition-all duration-300`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Bot className="size-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {getStatusMessage()}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getRedirectMessage()}
                </p>
              </div>
            </div>

            {/* Detailed steps */}
            <div className="space-y-2">
              {initialTypingSteps.slice(0, typingIndex).map((msg, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className={`p-1 rounded-full mt-1 ${idx < typingIndex - 1 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                    {idx < typingIndex - 1 ? (
                      <svg className="w-3 h-3 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <Bot className="size-3 text-blue-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{msg}</span>
                </div>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  onClick={() => setOpenModal(false)}
                  className="mt-3 w-full"
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}