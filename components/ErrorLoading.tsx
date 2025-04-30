import { Button } from "./ui/button";

interface ErrorLoadingProps {
  message: string;
  error: string;
}

const ErrorLoading = ({ message, error }: ErrorLoadingProps) => {
  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full rounded-xl border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950 p-6 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-red-800 dark:text-red-300 mb-2">
            {message}
          </h2>

          <p className="text-sm text-red-700 dark:text-red-400 mb-6">
            {error}
          </p>

          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ErrorLoading };
