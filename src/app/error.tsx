'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, Map } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#111827] border border-amber-500/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-5xl mb-4">🪔</div>
        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          An unexpected error occurred while loading this page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl transition-all shadow-md"
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all border border-white/10"
          >
            <Home size={16} /> Home
          </Link>
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-all border border-white/10"
          >
            <Map size={16} className="text-amber-400" /> Map
          </Link>
        </div>
      </div>
    </div>
  );
}
