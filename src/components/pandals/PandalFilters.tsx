'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  zones: string[];
  currentZone?: string;
  currentQuery?: string;
}

export default function PandalFilters({ zones, currentZone, currentQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery ?? '');

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('q', query);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pandals by name or area..."
          className="w-full bg-[#1F2937] border border-amber-500/20 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/50 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              updateParams('q', '');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </form>

      {/* Zone pills */}
      <div className="flex flex-wrap gap-2">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => updateParams('zone', z)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              (currentZone ?? 'All') === z
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {z}
          </button>
        ))}
      </div>
    </div>
  );
}
