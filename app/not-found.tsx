// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="flex flex-col items-center gap-4 text-center">
        <Ghost className="w-16 h-16 text-blue-500 dark:text-emerald-400" />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Sorry, the page you were looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="btn-primary mt-4">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
