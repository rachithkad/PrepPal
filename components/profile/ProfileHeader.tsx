"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import {  LogOut } from "lucide-react";

type ProfileHeaderProps = {
  name: string;
  email: string;
};

const ProfileHeader = ({ name, email }: ProfileHeaderProps) => {
  const router = useRouter();
  const initial = name?.[0]?.toUpperCase() || "?";

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in"); 
  };

  return (
    <div className="flex flex-col items-center text-center py-8 px-4 sm:flex-row sm:justify-between sm:text-left sm:px-10 border-b border-border gap-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-muted text-foreground flex items-center justify-center text-3xl font-bold shadow">
          {initial}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground text-sm">{email}</p>
        </div>
      </div>

      <Button onClick={handleSignOut} className="sm:mt-0 bg-destructive text-white hover:bg-destructive/90 cursor-pointer">
        Sign Out <LogOut />
      </Button>
    </div>
  );
};

export default ProfileHeader;
