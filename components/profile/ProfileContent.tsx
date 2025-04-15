"use client";

import { useEffect, useState } from "react";
import { getUserInterviewStats } from "@/lib/actions/general.action";
import ProgressSnapshot from "@/components/profile/ProgressSnapshot";
import DonutChart from "@/components/profile/DonutChart";
import LineChart from "@/components/profile/LineChart";
import BarChart from "@/components/profile/BarChart";
import SkeletonBox from "@/components/profile/SkeletonBox";

interface Props {
  userId: string;
}

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
      <>
        {/* Progress Snapshot Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-6">
          <SkeletonBox className="h-60 w-full rounded-2xl" />
          <SkeletonBox className="h-60 w-full rounded-2xl" />
          <SkeletonBox className="h-60 w-full col-span-full md:col-span-2 rounded-2xl" />
        </section>
      </>
    );
  }

  if (isStatsEmpty) {
    return (
      <div className="flex flex-col items-center justify-center px-4 mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-2">No Interview Data</h2>
        <p className="text-muted-foreground">
          You haven’t completed any interviews yet. Once you start, your stats will appear here!
        </p>
      </div>
    );
  }

  return (
    <>
      <ProgressSnapshot {...stats} />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 mt-6">
        <div className="bg-card rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Score Over Time</h2>
          <LineChart data={stats.lineChartData} />
        </div>
        <div className="bg-card rounded-2xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Interview Types</h2>
          <BarChart data={stats.barChartData} />
        </div>
        <div className="bg-card rounded-2xl shadow p-4 col-span-full md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Favorite Tech</h2>
          <DonutChart data={stats.donutChartData} />
        </div>
      </section>
    </>
  );
}
