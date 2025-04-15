import InterviewForm from "@/components/InterviewForm";

export default function GenerateInterviewPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Fill out the Form to Generate a Mock Interview</h1>
      <InterviewForm />
    </main>
  );
}
