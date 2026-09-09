import { Suspense } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, Map, BookOpen, ArrowRight, Users } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';
import CalendarStrip from '@/components/ui/CalendarStrip';
import PandalCard from '@/components/ui/PandalCard';
import HomeClient from '@/components/home/HomeClient';
import type { Pandal } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import scrapedPandalsFallback from '@/data/scraped-pandals.json';

async function getFeaturedPandals(): Promise<Pandal[]> {
  try {
    const fetchFromPrisma = async () => {
      const defaultFestival = await prisma.festival.findUnique({
        where: { slug: 'durga-puja-2026' },
      });
      if (!defaultFestival) return [];
      return await prisma.pandal.findMany({
        where: {
          festivalId: defaultFestival.id,
          isFeatured: true,
        },
        include: {
          editions: { orderBy: { year: 'desc' }, take: 1 },
        },
        take: 8,
      });
    };

    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 2000)
    );

    const result = await Promise.race([fetchFromPrisma(), timeoutPromise]);
    if (result && result.length > 0) {
      return result as unknown as Pandal[];
    }
  } catch (err) {
    console.warn('Prisma featured pandals fallback:', err);
  }

  // Fallback to scraped dataset featured items
  const featured = (scrapedPandalsFallback as any[])
    .filter((p) => p.isFeatured)
    .slice(0, 8);
  return (featured.length > 0 ? featured : (scrapedPandalsFallback as any[]).slice(0, 8)) as unknown as Pandal[];
}

export default async function HomePage() {
  const featuredPandals = await getFeaturedPandals();

  const quickLinks = [
    { href: '/pandals', icon: MapPin, label: 'Find Pandals', desc: '25+ verified locations', color: 'amber' },
    { href: '/map', icon: Map, label: 'Live Map', desc: 'Navigate with routing', color: 'emerald' },
    { href: '/ai-guide', icon: Sparkles, label: 'Purohit-mosai', desc: 'Ask anything about puja', color: 'purple' },
    { href: '/guide', icon: BookOpen, label: 'Festival Guide', desc: 'Rituals, history & food', color: 'red' },
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

  return <HomeClient featuredPandals={featuredPandals} />;
}
