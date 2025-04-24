import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav>
        <div className="flex justify-between w-full">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Mockhiato Logo" width={44} height={38} />
            <h2 className="text-primary-100">Mockhiato</h2>
          </Link>
          <Link href="/profile" className="flex items-end justify-end">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          </Link>
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;