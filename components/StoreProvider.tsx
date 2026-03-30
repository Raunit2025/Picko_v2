"use client";

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

/**
 * Prevents server-rendered HTML from mismatching client Zustand state.
 * Renders a stable loading shell until localStorage has been read.
 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const _hasHydrated = useStore((s) => s._hasHydrated);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before the component mounts on the client AND before Zustand has
  // read from localStorage, show a neutral shell so nothing flickers.
  if (!mounted || !_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50/60 to-gray-50">
        {/* Skeleton hero */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 min-h-[460px] flex items-center justify-center">
          <div className="text-center space-y-4 animate-pulse">
            <div className="h-10 w-80 bg-white/20 rounded-2xl mx-auto" />
            <div className="h-8 w-64 bg-white/15 rounded-2xl mx-auto" />
            <div className="h-12 w-44 bg-white/25 rounded-2xl mx-auto mt-6" />
          </div>
        </div>
        {/* Skeleton cards */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
