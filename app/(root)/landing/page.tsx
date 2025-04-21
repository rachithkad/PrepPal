// Import the next/image component
import Image from 'next/image';
// Import UI components (assuming they exist at these paths)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Import icons
import { RocketIcon, MicIcon, FileTextIcon, StarIcon, LightbulbIcon, Code2Icon } from "lucide-react";

export default function LandingPage() {
  return (
    // Main container with background gradient and padding
    <main className="min-h-screen bg-gradient-to-br from-[#0e0e10] via-[#1c1c1f] to-[#121212] text-white px-4 md:px-20 py-20 font-sans">

      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        {/* AI-Powered Badge */}
        <Badge className="bg-primary-foreground text-primary border border-primary px-4 py-2 text-sm rounded-full">
          AI-Powered Interview Prep
        </Badge>
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Brew Confidence. <span className="text-primary">Ace Interviews</span>
        </h1>
        {/* Subtitle/Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Mockhiato is your personal AI interviewer and resume analyzer, helping you practice technical interviews and optimize your resume for any job role.
        </p>
        {/* Call to Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <Button className="text-lg px-10 py-5 shadow-xl bg-primary hover:bg-primary/90 transition-all rounded-full">
            Get Started
          </Button>
          <Button variant="outline" className="text-lg px-10 py-5 border-gray-500 hover:bg-gray-800 transition-all rounded-full">
            Learn More
          </Button>
        </div>
        {/* Hero Image using next/image */}
        <div className="mt-12 relative w-full max-w-3xl mx-auto aspect-[2/1]"> {/* Added relative positioning and aspect ratio */}
          <Image
            // Placeholder image URL - replace with your actual image
            src="/"
            alt="AI Interview Simulation illustration"
            // Required width and height for next/image with remote URLs
            // Using layout="fill" makes the image fill the parent container
            layout="fill"
            objectFit="cover" // Equivalent to object-cover
            className="rounded-2xl shadow-xl" // Tailwind classes for styling
            // You might not need onError with next/image as it has built-in handling,
            // but you can add placeholder prop for low-res previews if needed.
            // placeholder="blur" // Optional: requires blurDataURL
            // blurDataURL="data:..." // Optional: provide a base64 blur image
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {/* Feature Card 1: Voice Interviews */}
        <div className="bg-[#1c1c1f] rounded-2xl border border-gray-800 hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
          {/* Feature Image using next/image */}
          <div className="relative w-full aspect-[16/10]"> {/* Container for aspect ratio */}
             <Image
              // Placeholder image URL - replace with your actual image
              src="/"
              alt="Voice-Based Mock Interview illustration"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform" // Apply hover effect here
            />
          </div>
          <div className="p-8 flex-grow">
            <MicIcon className="text-primary w-10 h-10 mb-4 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Voice-Based Mock Interviews</h3>
            <p className="text-muted-foreground">Practice real-time interviews with an AI interviewer using your voice, just like a real conversation.</p>
          </div>
        </div>

        {/* Feature Card 2: Resume Analysis */}
        <div className="bg-[#1c1c1f] rounded-2xl border border-gray-800 hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
           {/* Feature Image using next/image */}
           <div className="relative w-full aspect-[16/10]"> {/* Container for aspect ratio */}
            <Image
              // Placeholder image URL - replace with your actual image
              src="/"
              alt="Resume Analysis illustration"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-8 flex-grow">
            <FileTextIcon className="text-primary w-10 h-10 mb-4 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Resume Analysis & ATS Scoring</h3>
            <p className="text-muted-foreground">Upload your resume and get tailored feedback plus an ATS score matched to any job description.</p>
          </div>
        </div>

        {/* Feature Card 3: Progress Tracking */}
        <div className="bg-[#1c1c1f] rounded-2xl border border-gray-800 hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
           {/* Feature Image using next/image */}
           <div className="relative w-full aspect-[16/10]"> {/* Container for aspect ratio */}
            <Image
              // Placeholder image URL - replace with your actual image
              src="/"
              alt="Progress Tracking illustration"
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="p-8 flex-grow">
            <RocketIcon className="text-primary w-10 h-10 mb-4 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-muted-foreground">See how you improve over time with tracked scores, feedback, and personalized suggestions.</p>
          </div>
        </div>
      </section>

      {/* Why Mockhiato Section */}
      <section className="mt-32 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Why Mockhiato?</h2>
        <p className="text-muted-foreground text-lg mb-10">What makes us different from traditional prep platforms</p>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          {/* Point 1: Realistic Simulation */}
          <div className="flex items-start gap-4">
            <StarIcon className="text-primary w-8 h-8 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Realistic Interview Simulation</h3>
              <p className="text-muted-foreground">No multiple-choice shortcuts. Just natural voice interactions with intelligent follow-up questions.</p>
            </div>
          </div>

          {/* Point 2: AI Feedback */}
          <div className="flex items-start gap-4">
            <LightbulbIcon className="text-primary w-8 h-8 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">AI Feedback & Insights</h3>
              <p className="text-muted-foreground">Get automated, structured feedback on every interview attempt across multiple skill categories.</p>
            </div>
          </div>

          {/* Point 3: Tech Stack Aware */}
          <div className="flex items-start gap-4">
            <Code2Icon className="text-primary w-8 h-8 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Tech Stack Aware</h3>
              <p className="text-muted-foreground">Specify your preferred tech and we’ll tailor your interviews to React, Node.js, Python, or anything else.</p>
            </div>
          </div>

          {/* Point 4: Resume Tailoring */}
          <div className="flex items-start gap-4">
            <FileTextIcon className="text-primary w-8 h-8 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-xl">Resume Tailoring by Role</h3>
              <p className="text-muted-foreground">Match your resume to job roles or JD and get improvement suggestions to increase your hiring chances.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action (CTA) */}
      <section className="mt-32 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to boost your confidence?</h2>
        <Button className="text-lg px-10 py-5 bg-primary shadow-lg hover:bg-primary/80 transition-all rounded-full">
          Start Your Free Trial
        </Button>
      </section>
    </main>
  );
}
