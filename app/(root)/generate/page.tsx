"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BrainCog, FileText, Mic } from "lucide-react";

const options = [
  {
    title: "Via Form",
    description: "Fill out a structured form with details like role, level, and domain.",
    icon: <FileText className="w-6 h-6 text-primary" />,
    href: "/generate/form",
  },
  {
    title: "Via Job Description / Resume",
    description: "Paste a job description or upload your resume to auto-generate questions.",
    icon: <BrainCog className="w-6 h-6 text-primary" />,
    href: "/generate/jd-resume",
  },
  {
    title: "Via Voice Agent",
    description: "Talk to our AI agent to create a personalized interview experience.",
    icon: <Mic className="w-6 h-6 text-primary" />,
    href: "/interview",
  },
];

export default function GenerateInterviewPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center px-4 py-12 bg-background text-foreground">
      <div className="max-w-4xl w-full text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold">How do you want to generate your interview?</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Choose a method below to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {options.map((opt, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card
                onClick={() => router.push(opt.href)}
                className="cursor-pointer border border-muted bg-card hover:shadow-xl transition-all h-full rounded-2xl p-4 flex flex-col items-center text-center gap-4"
              >
                <div className="bg-primary/10 p-4 rounded-full">
                  {opt.icon}
                </div>
                <h2 className="text-xl font-semibold">{opt.title}</h2>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
