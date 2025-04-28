import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { getDateByResumeID } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Calendar, Star, CheckCircle, XCircle } from "lucide-react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

interface ResumeCardProps {
  resumeId: string;
  userId?: string;
  atsScore: number;
  matched: string[];
  missing: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  createdAt?: Date;
  company?: string;
  jobRole?: string;
}

const ResumeCard = async ({
  resumeId,
  userId,
  atsScore,
  matched,
  missing,
  strengths,
  weaknesses,
  suggestions,
  createdAt,
  company,
  jobRole,
}: ResumeCardProps) => {
  const currentUser = await getCurrentUser();
  const id = resumeId;
  const feedback = userId
    ? await getDateByResumeID(userId, resumeId)
    : null;

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");


  const badgeColor = atsScore > 69
    ? "bg-green-100 text-green-800"
    : atsScore > 49
    ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800";

  return (
    <div className="relative w-[360px] max-sm:w-full min-h-96 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">


      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex-grow">

          {/* Resume Created Date */}
          <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white capitalize">
            {jobRole} Resume
          </h3>
          
          {/* Keywords Match Info */}
          <div className="flex flex-wrap gap-5 mt-4 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-2xl text-emerald-400" />
              <p className="text-sm">{matched.length} Matched Keywords</p>
            </div>
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-2xl text-red-400" />
              <p className="text-sm">{missing.length} Missing Keywords</p>
            </div>
          </div>

          {/* Strengths & Weaknesses Count */}
          <div className="mt-4 text-gray-600 dark:text-gray-400 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-2xl text-emerald-400" />
              <p className="text-sm">{strengths.length} Strengths</p>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <FiAlertTriangle className="text-2xl text-red-400" />
              <p className="text-sm">{weaknesses.length} Weaknesses</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center">
              <Image
                src="/calendar.svg"
                width={18}
                height={18}
                alt="calendar"
                className="dark:invert"
              />
              <p className="text-sm">{formattedDate}</p>
        </div>

        {/* ATS Score Badge */}
      <div className="relative h-24 w-24 mx-auto">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#374151"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="3"
            strokeDasharray={`${atsScore}, 100`}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>

      {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-500">
            {atsScore}%
          </div>
        </div>
      </div>
      <div className="text-sm text-center text-gray-400 mt-2 transition-opacity duration-700">
            ATS Score
      </div>

        {/* View Resume Button */}
        <div className="pt-6">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
          >
            <Link href={`/resume-analytics/${id}/feedback`}>
              View Feedback
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;