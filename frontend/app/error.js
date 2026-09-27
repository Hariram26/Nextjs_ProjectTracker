'use client';
// error.js MUST be a client component — Next.js requirement

import { HiOutlineExclamation, HiOutlineRefresh } from "react-icons/hi";

// Next.js automatically passes two props:
//   error → the error object (what went wrong)
//   reset → a function to retry rendering the page
export default function Error({ error, reset }) {
    return (
        <div className="container mx-auto px-6 py-16 flex items-center justify-center">
            <div className="max-w-md w-full text-center">

                {/* Error Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-6">
                    <HiOutlineExclamation className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Something went wrong!
                </h2>

                {/* Error Message */}
                <p className="text-zinc-500 dark:text-zinc-400 mt-3">
                    An unexpected error occurred while loading this page.
                    Please try again.
                </p>

                {/* Error Details (helpful for debugging) */}
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400 font-mono break-words">
                        {error?.message || "Unknown error"}
                    </p>
                </div>

                {/* Try Again Button — calls reset() to re-attempt rendering */}
                <button
                    onClick={() => reset()}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-violet-800 hover:bg-violet-700 text-white font-medium rounded-xl transition-all active:scale-[0.98] shadow-md"
                >
                    <HiOutlineRefresh className="w-5 h-5" />
                    Try Again
                </button>
            </div>
        </div>
    );
}
