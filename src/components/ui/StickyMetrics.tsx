'use client';

import { useContext } from 'react';
import { Eye, Users } from 'lucide-react';
import { LanguageContext } from '@/context/LanguageContext';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { formatNumberWithGrouping } from '@/lib/formatters';

export default function StickyMetrics() {
  const { language } = useContext(LanguageContext);
  const stats = useLiveMetrics();

  if (stats.totalViews === 0) return null;

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-50 animate-float pointer-events-none">
      <div className="glass px-5 py-3 rounded-2xl flex items-center gap-5 text-sm font-bold shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20">
        <div className="flex items-center gap-2 text-gray-200">
          <Eye size={16} className="text-saffron" />
          <span className="bg-gradient-to-r from-saffron to-yellow-400 bg-clip-text text-transparent drop-shadow-md text-lg">
            {formatNumberWithGrouping(stats.totalViews, language)}
          </span>
        </div>
        
        <div className="w-px h-6 bg-white/20" />
        
        <div className="flex items-center gap-2 text-gray-200">
          <div className="relative">
            <Users size={16} className="text-electric" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-electric rounded-full animate-pulse shadow-[0_0_8px_rgba(217,70,239,1)]" />
          </div>
          <span className="bg-gradient-to-r from-electric to-purple-400 bg-clip-text text-transparent drop-shadow-md text-lg">
            {formatNumberWithGrouping(stats.activeSessions, language)}
          </span>
        </div>
      </div>
    </div>
  );
}
