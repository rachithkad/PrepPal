import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";


const Page = async () => {
  const user = await getCurrentUser();

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div
          
          className="text-center mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 mb-2">
            Interview Generation
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start your personalized mock interview with our AI assistant
          </p>
        </div>

        <div
          
        >
          <Agent
            userName={user?.name!}
            userId={user?.id}
            type="generate"
          />
        </div>
      </div>
    </main>
  );
};

export default Page;