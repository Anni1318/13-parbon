'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { MapPin, Sparkles, Map, BookOpen, ArrowRight, Users, Star, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CountdownTimer from '@/components/ui/CountdownTimer';
import CalendarStrip from '@/components/ui/CalendarStrip';

import SunriseTransition from '@/components/ui/SunriseTransition';
import FestivalExplorer from './FestivalExplorer';
import FeatureShowcase from './FeatureShowcase';
import PandalCard from '@/components/ui/PandalCard';
import StickyMetrics from '@/components/ui/StickyMetrics';
import HomeAudioButtons from '@/components/audio/HomeAudioButtons';
import type { Pandal } from '@/lib/types';

const ZONE_SPOTLIGHTS = [
  {
    name: 'North Kolkata',
    tag: 'Heritage & Traditional',
    desc: 'Bagbazar, Kumartuli Park, Sovabazar, Ahiritola',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    zoneParam: 'North Kolkata',
    icon: '🏛️',
  },
  {
    name: 'South Kolkata',
    tag: 'Themes & Crowd Favorites',
    desc: 'Suruchi Sangha, Maddox Square, Chetla Agrani, Ekdalia',
    color: 'from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/30 text-fuchsia-400',
    zoneParam: 'South Kolkata',
    icon: '🎨',
  },
  {
    name: 'Central Kolkata',
    tag: 'Illuminations & Dazzle',
    desc: 'College Square, Md. Ali Park, Santosh Mitra Square',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    zoneParam: 'Central Kolkata',
    icon: '💡',
  },
  {
    name: 'Salt Lake',
    tag: 'Architectural Marvels',
    desc: 'FD Block, BJ Block, AK Block, Labony Estate',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    zoneParam: 'Salt Lake',
    icon: '🏰',
  },
  {
    name: 'Behala',
    tag: 'Cultural Soul & Artistry',
    desc: 'Behala Club, Behala Nutan Dal, Barisha Club',
    color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
    zoneParam: 'Behala',
    icon: '🎭',
  },
  {
    name: 'Howrah',
    tag: 'Across the River Ganges',
    desc: 'Shibpur Mandirtala, Salkia, Kadamtala',
    color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/30 text-cyan-400',
    zoneParam: 'Howrah',
    icon: '🌉',
  },
];

export default function HomeClient({ featuredPandals }: { featuredPandals: Pandal[] }) {
  const { t } = useTranslation();

  const quickLinks = [
    { href: '/pandals', icon: MapPin, label: t('home.quick_links.find_pandals'), desc: t('home.quick_links.find_pandals_desc'), color: 'amber' },
    { href: '/map', icon: Map, label: t('home.quick_links.live_map'), desc: t('home.quick_links.live_map_desc'), color: 'emerald' },
    { href: '/ai-guide', icon: Sparkles, label: t('home.quick_links.ai_guide'), desc: t('home.quick_links.ai_guide_desc'), color: 'purple' },
    { href: '/guide', icon: BookOpen, label: t('home.quick_links.festival_guide'), desc: t('home.quick_links.festival_guide_desc'), color: 'red' },
  ];

  const colorMap: Record<string, string> = {
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 hover:border-amber-500/40',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 hover:border-emerald-500/40',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40',
    red: 'from-red-500/20 to-red-600/5 border-red-500/20 hover:border-red-500/40',
  };
  const iconColorMap: Record<string, string> = {
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
  };

  return (
    <div className="min-h-[100dvh]">
      <StickyMetrics />
      {/* Hero */}
      <section 
        className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-black"
      >
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 mt-20">
          <div className="w-full max-w-6xl mx-auto px-4">
            <img 
              src="/images/durga-silhouette.png" 
              alt="Durga Silhouette"
              className="object-contain w-full h-auto"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#450a0a] z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center pt-40 px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white drop-shadow-lg font-serif">
            {t('home.tagline', 'The Grandest Festival of Bengal')}
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mt-4 max-w-2xl">
            {t('home.sub_tagline', 'Experience the joy, devotion, and culture of 12 MASE 13 PARBON.')}
          </p>

          <Suspense fallback={null}>
            <CountdownTimer />
          </Suspense>

          <div className="mt-8 p-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-full inline-block cursor-pointer hover:scale-105 transition-transform duration-300">
            <Link
              href="/pandals"
              className="bg-[#0f0f0f] px-8 py-3 rounded-full text-white font-medium flex items-center gap-2"
            >
              <MapPin size={22} /> {t('home.explore_pandals', 'Explore Pandals')}
            </Link>
          </div>
        </div>
      </section>
      <div className="relative z-10 bg-transparent">
        <FestivalExplorer />
      </div>

      <SunriseTransition />


      <div className="relative z-10 bg-[#080414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* Audio Buttons */}
        <HomeAudioButtons />

        {/* Quick Links */}
        <section>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2"
          >
            <Sparkles className="text-amber-400" size={20} /> {t('home.explore_title')}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={2000}>
                    <Link
                      href={link.href}
                      className={`block group bg-gradient-to-br ${colorMap[link.color]} border rounded-2xl p-5 transition-all shadow-lg hover:shadow-${link.color}-500/20 glass`}
                    >
                      <Icon size={28} className={`mb-3 ${iconColorMap[link.color]} group-hover:scale-110 transition-transform`} />
                      <h3 className="font-bold text-white text-sm mb-1">{link.label}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{link.desc}</p>
                      <ArrowRight
                        size={14}
                        className="mt-3 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  </Tilt>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Featured Pandals */}
        {featuredPandals && featuredPandals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-serif font-bold text-white flex items-center gap-2"
              >
                <Star className="text-amber-400 fill-amber-400" size={20} /> Featured Pandals
              </motion.h2>
              <Link
                href="/pandals"
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
              >
                View all 400+ pandals <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredPandals.slice(0, 4).map((pandal) => (
                <PandalCard key={pandal.id} pandal={pandal as any} />
              ))}
            </div>
          </section>
        )}

        {/* Explore Kolkata by Zone */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-serif font-bold text-white flex items-center gap-2"
              >
                <Compass className="text-amber-400" size={22} /> Explore Kolkata by Zone
              </motion.h2>
              <p className="text-xs text-gray-400 mt-1">
                Hop directly into any corner of Kolkata on our interactive live GPS map
              </p>
            </div>
            <Link
              href="/map"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
            >
              Open Live Map <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZONE_SPOTLIGHTS.map((zone, idx) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.03} transitionSpeed={2000} className="h-full">
                  <div className={`glass rounded-3xl p-5 border flex flex-col justify-between h-full bg-gradient-to-br ${zone.color} hover:border-amber-400/50 transition-all`}>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-2xl">{zone.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                          {zone.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{zone.name}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed mb-4">
                        {zone.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      <Link
                        href={`/map?zone=${encodeURIComponent(zone.zoneParam)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-amber-300 transition-colors"
                      >
                        <Map size={13} className="text-amber-400" />
                        <span>Live Map</span>
                      </Link>

                      <Link
                        href={`/pandals?zone=${encodeURIComponent(zone.zoneParam)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                      >
                        <span>Directory</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Groups CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 px-6 rounded-3xl glass border border-amber-500/20 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Users size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <Users size={32} className="text-amber-400" />
            </div>
            <h3 className="font-bold font-serif text-2xl text-white mb-2">{t('home.plan_with_group')}</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">
              {t('home.plan_with_group_desc')}
            </p>
            <Link
              href="/groups"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
            >
              <Users size={18} /> {t('home.start_group')}
            </Link>
          </div>
        </motion.section>
      </div>

      {/* Feature Showcase (App Preview) */}
      <FeatureShowcase />
      </div>
    </div>
  );
}
