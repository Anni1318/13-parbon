'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, ExternalLink, Map, Plus, Check } from 'lucide-react';
import type { Pandal } from '@/lib/types';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { isPandalInTour, toggleTourStop } from '@/lib/itinerary';

interface PandalCardProps {
  pandal: Pandal & { editions?: { year: number; theme: string | null; awards: string }[] };
  compact?: boolean;
}

export default function PandalCard({ pandal, compact = false }: PandalCardProps) {
  const [inTour, setInTour] = useState(false);
  const latestEdition = pandal.editions?.[0];
  let awards: string[] = [];
  try {
    awards = latestEdition?.awards ? JSON.parse(latestEdition.awards) : [];
  } catch {
    awards = [];
  }

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

  const handleToggleTour = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleTourStop(pandal as any);
    setInTour(updated);
  };

  const mapHref = `/map?pandal=${encodeURIComponent(pandal.slug || pandal.id)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Tilt
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        scale={1.05}
        transitionSpeed={2000}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor="#d946ef"
        glareBorderRadius="24px"
        glarePosition="all"
        className="h-full"
      >
      <div
        className={`group glass rounded-3xl overflow-hidden transition-all hover:border-saffron border-t-2 border-l-2 border-white/20 hover:shadow-[20px_20px_60px_rgba(249,115,22,0.4),inset_0_0_20px_rgba(217,70,239,0.2)] flex flex-col h-full relative transform-gpu ${
          compact ? 'p-5' : 'p-6'
        }`}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/pandals/${pandal.slug || pandal.id}`} className="group-hover:text-saffron transition-colors">
            <h3
              className={`font-sans font-black text-white leading-tight group-hover:text-saffron transition-colors ${
                compact ? 'text-base' : 'text-xl'
              }`}
            >
              {pandal.name}
            </h3>
          </Link>
          {pandal.isFeatured && (
            <Star size={16} className="text-electric fill-electric shrink-0 mt-0.5 animate-pulse drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]" />
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-300 font-medium text-xs mb-4">
          <MapPin size={12} className="text-saffron" />
          <span>
            {pandal.area}, {pandal.zone}
          </span>
        </div>

        {/* Theme badge */}
        {latestEdition?.theme && latestEdition.theme.toLowerCase() !== 'traditional durga puja' && (
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-saffron/20 text-saffron border border-saffron/30 px-3 py-1.5 rounded-full inline-block shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]">
              2026: {latestEdition.theme}
            </span>
          </div>
        )}

        {/* Awards */}
        {!compact && awards.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {awards.slice(0, 2).map((award, i) => (
              <span
                key={i}
                className="text-[9px] uppercase tracking-widest font-bold bg-gradient-to-r from-electric/20 to-purple-600/20 text-electric border border-electric/30 px-2 py-1 rounded-md"
              >
                🏆 {award}
              </span>
            ))}
          </div>
        )}

        {/* Footer with Action Buttons */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 group-hover:border-saffron/20 transition-colors gap-2">
          {/* Action: Quick Map Link */}
          <Link
            href={mapHref}
            title="Locate on Map"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-amber-400 font-semibold transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
          >
            <Map size={13} />
            <span className="hidden sm:inline">Map</span>
          </Link>

          {/* Action: Add to Tour Toggle */}
          <button
            onClick={handleToggleTour}
            title={inTour ? 'Remove from tour' : 'Add to tour'}
            className={`flex items-center gap-1 text-xs font-bold py-1 px-2.5 rounded-lg border transition-all active:scale-95 ${
              inTour
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {inTour ? <Check size={13} /> : <Plus size={13} />}
            <span>{inTour ? 'Saved' : 'Tour'}</span>
          </button>

          {/* Action: View Full Details */}
          <Link
            href={`/pandals/${pandal.slug || pandal.id}`}
            className="flex items-center gap-1 text-xs text-saffron hover:text-yellow-400 font-bold transition-colors uppercase tracking-widest ml-auto"
          >
            Explore <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </Tilt>
    </motion.div>
  );
}
