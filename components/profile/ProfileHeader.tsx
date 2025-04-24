"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-center py-8 px-4 sm:flex-row sm:justify-between sm:text-left sm:px-10 border-b border-gray-200 dark:border-gray-800 gap-6 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-gray-800/50"
    >
      <div className="flex items-center gap-5">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg"
        >
          {initial}
        </motion.div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{email}</p>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button 
          onClick={handleSignOut} 
          variant="destructive"
          className="group flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <span>Sign Out</span>
          <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileHeader;