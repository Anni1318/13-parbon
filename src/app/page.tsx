import { Suspense } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, Map, BookOpen, ArrowRight, Users } from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';
import CalendarStrip from '@/components/ui/CalendarStrip';
import PandalCard from '@/components/ui/PandalCard';
import HomeClient from '@/components/home/HomeClient';
import type { Pandal } from '@/lib/types';

async function getFeaturedPandals(): Promise<Pandal[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pandals?featured=true`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
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
