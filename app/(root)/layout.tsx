import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Mic, FileText, User } from "lucide-react";
import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <Image 
                src="/logo.svg" 
                alt="Mockhiato Logo" 
                width={54} 
                height={48}
                className="transition-transform group-hover:scale-110"
              />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                Mockhiato
              </h2>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/generate" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mic className="h-5 w-5" />
                <span>Mock Interview</span>
              </Link>
              <Link 
                href="/resume-analytics" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Resume Analytics</span>
              </Link>
            </div>
          </div>

          <Link 
            href="/profile" 
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-lg font-bold shadow-lg group-hover:shadow-xl transition-all">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span className="hidden md:inline text-gray-700 dark:text-gray-300">
              {user?.name || "Profile"}
            </span>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center gap-8 mt-4">
          <Link 
            href="/generate" 
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Mic className="h-5 w-5" />
            <span className="text-xs">Interview</span>
          </Link>
          <Link 
            href="/resume-analytics" 
            className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Resume</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;