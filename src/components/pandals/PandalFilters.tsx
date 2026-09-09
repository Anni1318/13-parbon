'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { Search, X, Star, ArrowUpDown, Filter } from 'lucide-react';

interface Props {
  zones: string[];
  currentZone?: string;
  currentQuery?: string;
  currentFeatured?: boolean;
  currentSort?: string;
}

export default function PandalFilters({
  zones,
  currentZone,
  currentQuery,
  currentFeatured = false,
  currentSort = 'featured',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery ?? '');

  useEffect(() => {
    setQuery(currentQuery ?? '');
  }, [currentQuery]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== 'All' && value !== 'false') {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: query });
  };

  const hasActiveFilters =
    (currentZone && currentZone !== 'All') ||
    Boolean(currentQuery) ||
    Boolean(currentFeatured) ||
    (currentSort && currentSort !== 'featured');

  const clearAllFilters = () => {
    setQuery('');
    router.push(pathname);
  };

  return (
    <div className="space-y-4">
      {/* Search & Top Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 400+ pandals by name, area, or zone..."
            className="w-full bg-[#1F2937] border border-amber-500/20 rounded-xl pl-10 pr-10 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-amber-500/50 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                updateParams({ q: null });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Quick Filter Buttons */}
        <div className="flex items-center gap-2">
          {/* Featured Toggle */}
          <button
            type="button"
            onClick={() => updateParams({ featured: currentFeatured ? null : 'true' })}
            className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition-all border shrink-0 ${
              currentFeatured
                ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-[#1F2937] text-gray-300 border-amber-500/20 hover:border-amber-500/40 hover:text-white'
            }`}
          >
            <Star
              size={15}
              className={currentFeatured ? 'fill-black text-black' : 'fill-amber-400/50 text-amber-400'}
            />
            <span>Featured</span>
          </button>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={currentSort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="appearance-none bg-[#1F2937] border border-amber-500/20 rounded-xl pl-8 pr-8 py-3 text-white text-sm font-semibold outline-none focus:border-amber-500/50 cursor-pointer transition-colors"
            >
              <option value="featured">Sort: Featured</option>
              <option value="name">Sort: A-Z</option>
              <option value="zone">Sort: By Zone</option>
            </select>
            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Zone pills */}
      <div className="flex flex-wrap items-center gap-2">
        {zones.map((z) => {
          const isSelected = (currentZone ?? 'All') === z;
          return (
            <button
              key={z}
              onClick={() => updateParams({ zone: z === 'All' ? null : z })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {z}
            </button>
          );
        })}

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all ml-auto"
          >
            <X size={12} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
