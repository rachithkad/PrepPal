import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Star, Code, Clock } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import { motion } from "framer-motion";

type SnapshotProps = {
  interviewsTaken: number;
  averageScore: number;
  favoriteTech: string;
  lastActive: string | null;
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function ProgressSnapshot({
  interviewsTaken,
  averageScore,
  favoriteTech,
  lastActive,
}: SnapshotProps) {
  const data = [
    {
      label: "Interviews Taken",
      value: <AnimatedCounter to={interviewsTaken} />,
      icon: <CalendarCheck className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-200 dark:border-blue-800"
    },
    {
      label: "Average Score",
      value: <AnimatedCounter to={averageScore} suffix="%" />,
      icon: <Star className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/30",
      border: "border-amber-200 dark:border-amber-800"
    },
    {
      label: "Favorite Tech",
      value: favoriteTech,
      icon: <Code className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-900/30",
      border: "border-emerald-200 dark:border-emerald-800"
    },
    {
      label: "Last Interviewed",
      value: lastActive
        ? new Date(lastActive).toLocaleDateString()
        : "---",
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50 dark:bg-purple-900/30",
      border: "border-purple-200 dark:border-purple-800"
    },
  ];

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mt-10 px-4"
    >
      <motion.h2 
        variants={fadeIn}
        className="text-2xl text-center md:text-3xl font-bold mb-6 text-gray-900 dark:text-white"
      >
        Progress Snapshot
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            variants={fadeIn}
            whileHover={{ y: -5 }}
          >
            <Card
              className={`rounded-xl shadow-sm hover:shadow-md transition-all ${item.color} ${item.border}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2">
                        <span className={`w-12 h-12 rounded-lg ${item.color.split(' ')[0]} flex items-center justify-center`}>
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {item.label}
                        </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-500">
                        {item.value}
                    </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}