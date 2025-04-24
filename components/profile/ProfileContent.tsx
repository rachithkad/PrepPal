"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserInterviewStats } from "@/lib/actions/general.action";
import ProgressSnapshot from "@/components/profile/ProgressSnapshot";
import DonutChart from "@/components/profile/DonutChart";
import LineChart from "@/components/profile/LineChart";
import BarChart from "@/components/profile/BarChart";
import SkeletonBox from "@/components/profile/SkeletonBox";

interface Props {
  userId: string;
}

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

export default function ProfileContent({ userId }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        const res = await getUserInterviewStats(userId);
        setStats(res);
      } catch (error) {
        console.error("Failed to fetch interview stats", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  const isStatsEmpty =
    !stats ||
    (stats.totalInterviews === 0 &&
      stats.passedInterviews === 0 &&
      stats.failedInterviews === 0 &&
      stats.pendingInterviews === 0 &&
      (!stats.lineChartData || stats.lineChartData.length === 0) &&
      (!stats.barChartData || stats.barChartData.length === 0) &&
      (!stats.donutChartData || stats.donutChartData.length === 0));

  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Progress Snapshot Skeleton */}
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 mt-6"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox 
              key={i} 
              className="h-32 w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700"
            />
          ))}
        </motion.div>

        {/* Charts Skeleton */}
        <motion.section 
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-6"
        >
          <SkeletonBox className="h-80 w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700" />
          <SkeletonBox className="h-80 w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700" />
          <SkeletonBox className="h-80 w-full col-span-full md:col-span-2 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700" />
        </motion.section>
      </motion.div>
    );
  }

  if (isStatsEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center px-4 py-16 text-center"
      >
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
            No Interview Data Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You haven't completed any interviews yet. Your stats will appear here once you start practicing!
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Practicing
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <AnimatePresence>
        <motion.div variants={fadeIn}>
          <ProgressSnapshot {...stats} />
        </motion.div>
      </AnimatePresence>

      <motion.section 
        variants={fadeIn}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-6"
      >
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Score Over Time
          </h2>
          <div className="h-64">
            <LineChart data={stats.lineChartData} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Interview Types
          </h2>
          <div className="h-64">
            <BarChart data={stats.barChartData} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 p-6 col-span-full md:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Favorite Technologies
          </h2>
          <div className="h-90">
            <DonutChart data={stats.donutChartData} />
          </div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}