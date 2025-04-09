import { getCurrentUser } from "@/lib/actions/auth.action";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProgressSnapshot from "@/components/profile/ProgressSnapshot";
import { getUserInterviewStats } from "@/lib/actions/general.action";
import DonutChart from "@/components/profile/DonutChart";
import LineChart from "@/components/profile/LineChart";
import BarChart from "@/components/profile/BarChart";
import SkeletonBox from "@/components/profile/SkeletonBox";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl">You need to be logged in to view this page.</p>
      </main>
    );
  }

  const stats = await getUserInterviewStats(user.id);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ProfileHeader name={user.name} email={user.email} />

      {stats ? (
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
      ) : (
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
      )}
    </main>
  );
}
