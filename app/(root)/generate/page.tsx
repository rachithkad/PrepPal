"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BrainCog, FileText, Mic } from "lucide-react";

const options = [
  {
    title: "Via Form",
    description: "Fill out a structured form with details like role, level, and domain.",
    icon: <FileText className="w-8 h-8" />,
    href: "/generate/form",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100/50 dark:bg-blue-900/20"
  },
  {
    title: "Via Resume",
    description: "Upload your resume to auto-generate questions.",
    icon: <BrainCog className="w-8 h-8" />,
    href: "/generate/resume",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100/50 dark:bg-purple-900/20"
  },
  // {
  //   title: "Via Voice Agent",
  //   description: "Talk to our AI agent to create a personalized interview experience.",
  //   icon: <Mic className="w-8 h-8" />,
  //   href: "/interview",
  //   color: "from-emerald-500 to-emerald-600",
  //   bgColor: "bg-emerald-100/50 dark:bg-emerald-900/20"
  // },
];

export default function GenerateInterviewPage() {
  const router = useRouter();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-4xl w-full text-center space-y-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
            Generate Your Interview
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Choose your preferred method to create a tailored interview experience
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
        >
          {options.map((opt, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => router.push(opt.href)}
                className={`cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all h-full rounded-2xl overflow-hidden group ${opt.bgColor}`}
              >
                <div className="p-6 flex flex-col items-center text-center gap-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${opt.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                    {opt.icon}
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {opt.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {opt.description}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    Get started
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.main>
  );
}