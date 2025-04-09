import { getCurrentUser } from "@/lib/actions/auth.action";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl">You need to be logged in to view this page.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ProfileHeader name={user.name} email={user.email} />
      {/* Next sections go here */}
    </main>
  );
}
