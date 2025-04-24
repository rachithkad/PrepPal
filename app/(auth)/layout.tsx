import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div
      className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="w-full max-w-md"
      >
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;