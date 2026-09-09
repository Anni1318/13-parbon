'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Map, Navigation, Plus, Check, Share2 } from 'lucide-react';
import type { Pandal } from '@/lib/types';
import { isPandalInTour, toggleTourStop } from '@/lib/itinerary';

export default function PandalDetailActions({ pandal }: { pandal: Pandal }) {
  const [inTour, setInTour] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInTour(isPandalInTour(pandal.id) || (pandal.slug ? isPandalInTour(pandal.slug) : false));

    const handleTourUpdate = () => {
      setInTour(isPandalInTour(pandal.id) || (pandal.slug ? isPandalInTour(pandal.slug) : false));
    };

    window.addEventListener('tour_itinerary_updated', handleTourUpdate);
    window.addEventListener('storage', handleTourUpdate);
    return () => {
      window.removeEventListener('tour_itinerary_updated', handleTourUpdate);
      window.removeEventListener('storage', handleTourUpdate);
    };
  }, [pandal.id, pandal.slug]);

  const handleToggleTour = () => {
    const updated = toggleTourStop(pandal);
    setInTour(updated);
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const mapHref = `/map?pandal=${encodeURIComponent(pandal.slug || pandal.id)}`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      {/* Live Map Link */}
      <Link
        href={mapHref}
        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
      >
        <Map size={16} /> Open in Live Map
      </Link>

      {/* Google Directions */}
      <a
        href={directionsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
      >
        <Navigation size={16} className="rotate-45" /> Directions
      </a>

      {/* Tour Planner Toggle */}
      <button
        onClick={handleToggleTour}
        className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-xl border transition-all active:scale-95 ${
          inTour
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 shadow-lg shadow-emerald-500/10'
            : 'bg-[#1F2937] text-white border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10'
        }`}
      >
        {inTour ? <Check size={16} /> : <Plus size={16} />}
        {inTour ? 'Saved to Tour' : 'Add to Tour Plan'}
      </button>

      {/* Share Pandal */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2937] hover:bg-white/10 text-gray-300 hover:text-white font-semibold text-sm rounded-xl border border-white/10 transition-all active:scale-95"
      >
        {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
        {copied ? 'Link Copied!' : 'Share'}
      </button>
    </div>
  );
}
