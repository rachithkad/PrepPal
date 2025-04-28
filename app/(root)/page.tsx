import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import ResumeCard from "@/components/ResumeCard";
import FadeIn from "@/components/FadeIn";
import Animation from "@/components/Animation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getResumesByUserId,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, upcomingInterviews, userResumes] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
    getResumesByUserId(user?.id!),
  ]);
  
  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (upcomingInterviews?.length ?? 0) > 0;
  const hasResumes = (userResumes?.length ?? 0) > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Get Interview-Ready with AI-Powered Practice & Resume Analytics
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Practice real interview questions, get instant feedback, and optimize your resume for ATS systems — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild className="btn-primary w-full sm:w-auto">
              <Link href="/generate">Generate an Interview</Link>
            </Button>
            <Button asChild variant="outline" className="btn-primary w-full sm:w-auto">
              <Link href="/resume-analytics">Analyze My Resume</Link>
            </Button>
          </div>
        </div>

        {/* Right Content (Animation) */}
        <div className="flex items-center justify-center p-8 max-sm:hidden">
          <Animation />
        </div>
      </section>


      {/* Past Interviews Section */}
      <FadeIn duration={400}>
        <section className="flex flex-col gap-6 mt-12">
          <h2>Your Interviews</h2>
          <div className="interviews-section">
            {hasPastInterviews ? (
              userInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={new Date(interview.createdAt)}
                  company={interview.company}
                />
              ))
            ) : (
              <p>You haven&apos;t taken any interviews yet.</p>
            )}
          </div>
        </section>
      </FadeIn>

      {/* Upcoming Interviews Section */}
      <FadeIn duration={600}>
        <section className="flex flex-col gap-6 mt-12">
          <h2>Take Interviews</h2>
          <div className="interviews-section">
            {hasUpcomingInterviews ? (
              upcomingInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={new Date(interview.createdAt)}
                  company={interview.company}
                />
              ))
            ) : (
              <p>There are no interviews available.</p>
            )}
          </div>
        </section>
      </FadeIn>

      {/* Resumes Section */}
      <FadeIn duration={800}>
        <section className="flex flex-col gap-6 mt-12">
          <h2>Your Resumes</h2>
          <div className="interviews-section">
            {hasResumes ? (
              userResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  jobRole={resume.analysis.jobRole}
                  resumeId={resume.resumeId}
                  userId={user?.id}
                  createdAt={new Date(resume.createdAt)}
                  atsScore={resume.analysis.atsScore}
                  matched={resume.analysis.keywordAnalysis.matched}
                  missing={resume.analysis.keywordAnalysis.missing}
                  strengths={resume.analysis.strengths}
                  weaknesses={resume.analysis.weaknesses} 
                  suggestions={[]} />
              ))
            ) : (
              <p>You haven&apos;t uploaded any resumes yet.</p>
            )}
          </div>
        </section>
      </FadeIn>
    </>
  );
}

export default Home;
