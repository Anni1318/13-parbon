'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Map, Navigation, ListChecks, Users, Rss, BookOpen, Sparkles, Calendar, Star, Book, Info, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/lib/formatters';

function FestivalCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      let targetObj = new Date(targetDate);
      let target = targetObj.getTime();
      let isCurrentlyLive = false;
      
      if (target < now) {
         const daysPassed = (now - target) / (1000 * 60 * 60 * 24);
         if (daysPassed <= 1) {
            isCurrentlyLive = true;
         } else {
            // Find next occurrence
            targetObj.setFullYear(new Date().getFullYear());
            if (targetObj.getTime() < now) {
               targetObj.setFullYear(new Date().getFullYear() + 1);
            }
            target = targetObj.getTime();
         }
      }

      if (isCurrentlyLive) {
        setIsLive(true);
      } else {
        setIsLive(false);
        const distance = target - now;
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isLive) return <div className="text-xl md:text-2xl font-bold text-amber-500 animate-pulse py-8">{t('countdown.is_live_now', 'FESTIVAL IS LIVE! 🎉')}</div>;

  return (
    <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
      {[
        { label: t('countdown.days', 'DAYS'), value: timeLeft.days },
        { label: t('countdown.hours', 'HOURS'), value: timeLeft.hours },
        { label: t('countdown.minutes', 'MINS'), value: timeLeft.minutes },
        { label: t('countdown.seconds', 'SECS'), value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center justify-center w-14 h-16 md:w-20 md:h-24 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-xl md:text-3xl font-bold text-white drop-shadow-md">
            {formatNumber(item.value, i18n.language).padStart(2, formatNumber(0, i18n.language))}
          </span>
          <span className="text-[8px] md:text-[10px] tracking-widest text-amber-500 uppercase mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function FestivalExplorer() {
  const { t, i18n } = useTranslation();

  const festivals = useMemo(() => [
    { 
      id: 'poila-baisakh', name: t('festivals.poila_baisakh.name', 'Poila Baisakh'), date: '2027-04-15T00:00:00', shortDesc: t('festivals.poila_baisakh.shortDesc', 'Bengali New Year'), details: t('festivals.poila_baisakh.details', 'Marks the beginning of the Bengali calendar. Businesses open new ledgers known as Hal Khata.'),
      calendarDays: [
        { id: 'pb1', date: '2027-04-14T00:00:00', name: t('festivals.poila_baisakh.pb1.name', 'Chaitra Sankranti'), details: t('festivals.poila_baisakh.pb1.details', 'End of Bengali year, Charak Puja.') },
        { id: 'pb2', date: '2027-04-15T00:00:00', name: t('festivals.poila_baisakh.pb2.name', 'Poila Baisakh'), details: t('festivals.poila_baisakh.pb2.details', 'First day of the Bengali new year.') }
      ]
    },
    { 
      id: 'jamai-sasthi', name: t('festivals.jamai_sasthi.name', 'Jamai Sasthi'), date: '2027-05-20T00:00:00', shortDesc: t('festivals.jamai_sasthi.shortDesc', 'Son-in-law\'s Day'), details: t('festivals.jamai_sasthi.details', 'Dedicated to sons-in-law, who are invited to their in-laws\' homes for a feast and traditional blessings.'),
      calendarDays: [{ id: 'js1', date: '2027-05-20T00:00:00', name: t('festivals.jamai_sasthi.js1.name', 'Jamai Sasthi'), details: t('festivals.jamai_sasthi.js1.details', 'Traditional feast and blessings.') }]
    },
    { 
      id: 'rath-yatra', name: t('festivals.rath_yatra.name', 'Rath Yatra'), date: '2026-07-14T00:00:00', shortDesc: t('festivals.rath_yatra.shortDesc', 'Chariot Festival'), details: t('festivals.rath_yatra.details', 'The grand chariot festival of Lord Jagannath, marked by massive processions.'),
      calendarDays: [
        { id: 'ry1', date: '2026-07-14T00:00:00', name: t('festivals.rath_yatra.ry1.name', 'Rath Yatra'), details: t('festivals.rath_yatra.ry1.details', 'Chariot procession begins.') },
        { id: 'ry2', date: '2026-07-22T00:00:00', name: t('festivals.rath_yatra.ry2.name', 'Ulta Rath'), details: t('festivals.rath_yatra.ry2.details', 'Return journey of the chariots.') }
      ]
    },
    { 
      id: 'jhulan-purnima', name: t('festivals.jhulan_purnima.name', 'Jhulan Purnima'), date: '2026-08-27T00:00:00', shortDesc: t('festivals.jhulan_purnima.shortDesc', 'Swing Festival'), details: t('festivals.jhulan_purnima.details', 'Celebrates the romance of Radha and Krishna featuring decorated swings during the monsoon.'),
      calendarDays: [{ id: 'jp1', date: '2026-08-27T00:00:00', name: t('festivals.jhulan_purnima.jp1.name', 'Jhulan Purnima'), details: t('festivals.jhulan_purnima.jp1.details', 'Swings decorated with flowers.') }]
    },
    { 
      id: 'janmashtami', name: t('festivals.janmashtami.name', 'Janmashtami'), date: '2026-09-04T00:00:00', shortDesc: t('festivals.janmashtami.shortDesc', 'Birth of Lord Krishna'), details: t('festivals.janmashtami.details', 'Marked by fasting and midnight prayers.'),
      calendarDays: [{ id: 'jm1', date: '2026-09-04T00:00:00', name: t('festivals.janmashtami.jm1.name', 'Janmashtami'), details: t('festivals.janmashtami.jm1.details', 'Midnight prayers and fasting.') }]
    },
    { 
      id: 'vishwakarma', name: t('festivals.vishwakarma.name', 'Vishwakarma Puja'), date: '2026-09-17T00:00:00', shortDesc: t('festivals.vishwakarma.shortDesc', 'Worship of the Divine Architect'), details: t('festivals.vishwakarma.details', 'Industrial workers and drivers bless their tools and vehicles, and the sky fills with kites.'),
      calendarDays: [{ id: 'vp1', date: '2026-09-17T00:00:00', name: t('festivals.vishwakarma.vp1.name', 'Vishwakarma Puja'), details: t('festivals.vishwakarma.vp1.details', 'Kite flying and tool worship.') }]
    },
    { 
      id: 'durga-puja', name: t('festivals.durga_puja.name', 'Durga Puja'), date: '2026-10-15T00:00:00.000Z', shortDesc: t('festivals.durga_puja.shortDesc', 'The Grand Celebration'), details: t('festivals.durga_puja.details', 'The multi-day celebration of Goddess Durga’s victory over Mahishasura.'),
      calendarDays: [
        { id: 'dp1', date: '2026-10-08T00:00:00', name: t('festivals.durga_puja.dp1.name', 'Mahalaya'), details: t('festivals.durga_puja.dp1.details', 'Brahma Muhurta (4:30 AM)') },
        { id: 'dp2', date: '2026-10-15T00:00:00', name: t('festivals.durga_puja.dp2.name', 'Maha Shashthi'), details: t('festivals.durga_puja.dp2.details', 'Bodhon & Adhibas') },
        { id: 'dp3', date: '2026-10-16T00:00:00', name: t('festivals.durga_puja.dp3.name', 'Maha Saptami'), details: t('festivals.durga_puja.dp3.details', 'Navapatrika Snan') },
        { id: 'dp4', date: '2026-10-17T00:00:00', name: t('festivals.durga_puja.dp4.name', 'Maha Ashtami'), details: t('festivals.durga_puja.dp4.details', 'Sandhi Puja (11:48 PM)') },
        { id: 'dp5', date: '2026-10-18T00:00:00', name: t('festivals.durga_puja.dp5.name', 'Maha Navami'), details: t('festivals.durga_puja.dp5.details', 'Maha Yagna & Bhog') },
        { id: 'dp6', date: '2026-10-19T00:00:00', name: t('festivals.durga_puja.dp6.name', 'Vijaya Dashami'), details: t('festivals.durga_puja.dp6.details', 'Bisarjan & Sindoor Khela') }
      ]
    },
    { 
      id: 'kojagari', name: t('festivals.kojagari.name', 'Kojagari Lakshmi Puja'), date: '2026-10-25T00:00:00', shortDesc: t('festivals.kojagari.shortDesc', 'Worship of the Goddess of Wealth'), details: t('festivals.kojagari.details', 'Families draw intricate alpana and pray for prosperity.'),
      calendarDays: [{ id: 'kl1', date: '2026-10-25T00:00:00', name: t('festivals.kojagari.kl1.name', 'Kojagari Purnima'), details: t('festivals.kojagari.kl1.details', 'Night-long vigil and prayers.') }]
    },
    { 
      id: 'kali-puja', name: t('festivals.kali_puja.name', 'Kali Puja'), date: '2026-11-08T00:00:00', shortDesc: t('festivals.kali_puja.shortDesc', 'Festival of Lights'), details: t('festivals.kali_puja.details', 'Worship of the fierce Goddess Kali alongside the lighting of diyas.'),
      calendarDays: [
        { id: 'kp1', date: '2026-11-07T00:00:00', name: t('festivals.kali_puja.kp1.name', 'Bhoot Chaturdashi'), details: t('festivals.kali_puja.kp1.details', 'Lighting of 14 diyas.') },
        { id: 'kp2', date: '2026-11-08T00:00:00', name: t('festivals.kali_puja.kp2.name', 'Kali Puja'), details: t('festivals.kali_puja.kp2.details', 'Midnight worship & Diwali.') }
      ]
    },
    { 
      id: 'bhai-phonta', name: t('festivals.bhai_phonta.name', 'Bhai Phonta'), date: '2026-11-10T00:00:00', shortDesc: t('festivals.bhai_phonta.shortDesc', 'Brother\'s Day'), details: t('festivals.bhai_phonta.details', 'Sisters apply a sandalwood dot on their brothers\' foreheads praying for their long lives.'),
      calendarDays: [{ id: 'bp1', date: '2026-11-10T00:00:00', name: t('festivals.bhai_phonta.bp1.name', 'Bhai Phonta'), details: t('festivals.bhai_phonta.bp1.details', 'Phonta ceremony in the morning.') }]
    },
    { 
      id: 'jagaddhatri', name: t('festivals.jagaddhatri.name', 'Jagaddhatri Puja'), date: '2026-11-17T00:00:00', shortDesc: t('festivals.jagaddhatri.shortDesc', 'Worship of Goddess Jagaddhatri'), details: t('festivals.jagaddhatri.details', 'Famous for massive idols and light displays in Chandannagar.'),
      calendarDays: [{ id: 'jdp1', date: '2026-11-17T00:00:00', name: t('festivals.jagaddhatri.jdp1.name', 'Jagaddhatri Puja'), details: t('festivals.jagaddhatri.jdp1.details', 'Main Puja day.') }]
    },
    { 
      id: 'poush-parbon', name: t('festivals.poush_parbon.name', 'Poush Parbon'), date: '2027-01-14T00:00:00', shortDesc: t('festivals.poush_parbon.shortDesc', 'Winter Harvest Festival'), details: t('festivals.poush_parbon.details', 'Centers around date palm jaggery and traditional sweets (pithe and puli).'),
      calendarDays: [{ id: 'pp1', date: '2027-01-14T00:00:00', name: t('festivals.poush_parbon.pp1.name', 'Makar Sankranti'), details: t('festivals.poush_parbon.pp1.details', 'Holy dip in the Ganges & Pithe Puli.') }]
    },
    { 
      id: 'saraswati', name: t('festivals.saraswati.name', 'Saraswati Puja'), date: '2027-02-10T00:00:00', shortDesc: t('festivals.saraswati.shortDesc', 'Festival of Knowledge'), details: t('festivals.saraswati.details', 'Worship of the Goddess of Knowledge, often considered the Bengali Valentine\'s Day.'),
      calendarDays: [{ id: 'sp1', date: '2027-02-10T00:00:00', name: t('festivals.saraswati.sp1.name', 'Vasant Panchami'), details: t('festivals.saraswati.sp1.details', 'Pushpanjali and cultural events.') }]
    }
  ], [t]);
  const [activeId, setActiveId] = useState('durga-puja');
  const activeFestival = festivals.find(f => f.id === activeId) || festivals.find(f => f.id === 'durga-puja') || festivals[0];

  return (
    <section className="bg-gradient-to-b from-[#450a0a] to-[#1a0f14] py-20 px-4 relative z-20 border-t border-red-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            {t('festivals_section.title', 'Baro Mase Tero Parbon')}
          </h2>
          <p className="text-red-200/80 text-base md:text-lg max-w-2xl mx-auto font-medium">
            {t('festivals_section.subtitle', 'Bengal is the land of 13 festivals in 12 months. Explore the rich cultural calendar of West Bengal.')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Switcher */}
          <div className="lg:w-1/3">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar { display: none; }
              `}} />
              
              {festivals.map(fest => (
                <button
                  key={fest.id}
                  onClick={() => setActiveId(fest.id)}
                  className={`text-left px-5 py-4 rounded-xl transition-all flex-shrink-0 lg:flex-shrink border ${
                    activeId === fest.id 
                      ? 'bg-gradient-to-r from-red-900/80 to-amber-900/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] text-white scale-[1.02]' 
                      : 'bg-black/20 border-white/5 text-gray-400 hover:bg-black/40 hover:text-gray-200'
                  }`}
                >
                  <div suppressHydrationWarning className="font-bold text-lg">{fest.name}</div>
                  <div suppressHydrationWarning className="text-xs opacity-70 mt-1 hidden lg:block">{new Date(fest.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-2/3 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFestival.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden shadow-2xl"
              >
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10">
                  <div className="text-amber-500 font-bold tracking-widest text-sm uppercase mb-2">
                    {activeFestival.shortDesc}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">
                    {activeFestival.name}
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl">
                    {activeFestival.details}
                  </p>

                  <div className="bg-black/40 rounded-2xl p-6 border border-white/5 inline-block w-full md:w-auto shadow-inner mb-10">
                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-4 text-center md:text-left font-semibold">
                      Next Celebration Begins In
                    </div>
                    <FestivalCountdown targetDate={activeFestival.date} />
                  </div>

                  {/* Dynamic Festival Calendar */}
                  {activeFestival.calendarDays && activeFestival.calendarDays.length > 0 && (
                    <div className="mt-4 mb-10">
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-amber-500" />
                        <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500">
                          Festival Calendar
                        </h4>
                      </div>
                      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
                        {activeFestival.calendarDays.map((day) => {
                          const dateObj = new Date(day.date);
                          return (
                            <div
                              key={day.id}
                              className="shrink-0 w-48 rounded-2xl bg-black/50 p-5 border border-white/10 shadow-lg"
                            >
                              <div suppressHydrationWarning className="text-xs font-bold text-amber-400 mb-2">
                                {dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </div>
                              <h5 className="font-bold text-lg text-white mb-2 leading-tight">
                                {day.name}
                              </h5>
                              <p className="text-xs text-gray-400 line-clamp-3">
                                {day.details}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeFestival.id === 'durga-puja' && (
                    <>
                      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { href: '/pandals', label: 'Pandals', icon: MapPin },
                          { href: '/map', label: 'Explore Map', icon: Map },
                          { href: '/plan', label: 'Plan Tour', icon: Navigation },
                          { href: '/checklist', label: 'Checklist', icon: ListChecks },
                          { href: '/groups', label: 'Groups', icon: Users },
                          { href: '/feed', label: 'Feed', icon: Rss },
                          { href: '/guide', label: 'Guide', icon: BookOpen },
                          { href: '/ai-guide', label: 'AI Guide', icon: Sparkles },
                        ].map(link => (
                          <Link 
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center justify-center gap-2 bg-black/40 hover:bg-amber-500/20 text-gray-300 hover:text-amber-500 border border-white/5 hover:border-amber-500/30 rounded-xl p-4 transition-all"
                          >
                            <link.icon size={24} className="mb-1" />
                            <span className="font-bold text-sm">{link.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Comprehensive Resources Addon */}
                      <div className="mt-12 bg-black/30 border border-amber-500/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                          <BookOpen size={20} className="text-amber-500" />
                          <h4 className="text-lg font-bold text-white font-serif">Comprehensive Resources</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {require('@/data/festival-options.json').map((category: any, idx: number) => (
                            <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-5">
                              <h5 className="font-bold text-amber-500 mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
                                {category.icon === 'HandsPraying' ? <Star size={14}/> : category.icon === 'Gopuram' ? <Book size={14}/> : category.icon === 'Info' ? <Info size={14}/> : <Trophy size={14}/>}
                                {category.category}
                              </h5>
                              <ul className="space-y-2">
                                {category.links.map((link: any, linkIdx: number) => {
                                  const targetUrl = link.url && link.url !== '#' ? link.url : (link.slug ? `/info/${link.slug}` : '#');
                                  const isExternal = targetUrl.startsWith('http');
                                  return (
                                    <li key={linkIdx}>
                                      {isExternal ? (
                                        <a
                                          href={targetUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-gray-300 hover:text-white flex items-center gap-1 group"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 group-hover:bg-amber-400 mr-2 transition-all"></span>
                                          {link.label}
                                        </a>
                                      ) : (
                                        <Link
                                          href={targetUrl}
                                          className="text-sm text-gray-300 hover:text-white flex items-center gap-1 group"
                                        >
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 group-hover:bg-amber-400 mr-2 transition-all"></span>
                                          {link.label}
                                        </Link>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
