import { getCurrentUser } from "@/lib/actions/auth.action";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProgressSnapshot from "@/components/profile/ProgressSnapshot";
import { getUserInterviewStats } from "@/lib/actions/general.action";

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
      
      {stats && <ProgressSnapshot {...stats} />}
      {/* Next sections go here */}
    </main>
  );
}
