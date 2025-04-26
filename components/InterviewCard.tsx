import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import InterviewImage from "./InterviewImage";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: Date;
  company?: string;
}

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  company,
}: InterviewCardProps) => {
  const currentUser = await getCurrentUser();
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({ interviewId, userId })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const badgeColor = {
    Behavioral: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    Mixed: "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200",
    Technical: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
  }[normalizedType] || "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="relative w-[360px] max-sm:w-full min-h-96 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Type Badge */}
      <div
        className={cn(
          "absolute top-0 right-0 px-3 py-1.5 rounded-bl-lg text-sm font-medium z-10",
          badgeColor
        )}
      >
        {normalizedType}
      </div>

      <div className="p-6 h-full flex flex-col">
        <div className="flex-grow">
          {/* Cover Image */}
          <InterviewImage company={company || ""} />

          {/* Interview Role */}
          <h3 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white capitalize">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row gap-5 mt-3 text-gray-600 dark:text-gray-400">
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

            <div className="flex flex-row gap-2 items-center">
              <Image
                src="/star.svg"
                width={18}
                height={18}
                alt="star"
                className="dark:invert"
              />
              <p className="text-sm">{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center pt-4">
          <DisplayTechIcons techStack={techstack} />

          <div className="hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
            >
              <Link
                href={
                  currentUser?.id === userId
                    ? feedback
                      ? `/interview/${interviewId}/feedback`
                      : `/interview/${interviewId}`
                    : `/interview/${interviewId}`
                }
              >
                {currentUser?.id === userId && feedback
                  ? "Check Feedback"
                  : "View Interview"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;