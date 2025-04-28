import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { FiAward, FiAlertTriangle } from "react-icons/fi";
import FadeIn from "@/components/FadeIn";

type ScoreCardProps = {
  score: number;
  threshold: number;
};

export default function ScoreCard({ score, threshold }: ScoreCardProps) {
  return (
    <FadeIn duration={400}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="flex justify-center"
      >
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8 text-center relative">
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
                  strokeDasharray={`${score}, 100`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${score}, 100` }}
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
                  {score}%
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-gray-400 mt-2"
                >
                  ATS Score
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-400 text-sm"
            >
              {score > threshold ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <FiAward className="text-lg" />
                  <span>Great job! Your resume is well-optimized.</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-amber-400">
                  <FiAlertTriangle className="text-lg" />
                  <span>Consider improving these areas for better results.</span>
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  );
}