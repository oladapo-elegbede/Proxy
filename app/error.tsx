// app/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6 text-center">

        <div className="space-y-2">
          <h1 className="text-heading font-semibold text-neutral-800">
            Something went wrong
          </h1>
          <p className="text-body text-neutral-500">
            Your information is safe.
          </p>
          <p className="text-body text-neutral-500">
            Nothing has been lost.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="block w-full rounded-card bg-primary-500 px-8 py-4 text-center text-body font-semibold text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Try again
          </button>

          <a
            href="/"
            className="block w-full rounded-card border border-neutral-200 px-8 py-4 text-center text-body font-medium text-neutral-600 hover:bg-neutral-100 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
          >
            Return to home
          </a>
        </div>

        <p className="text-sm text-neutral-400">
          If this keeps happening, try refreshing the page.
        </p>

      </div>
    </div>
  );
}