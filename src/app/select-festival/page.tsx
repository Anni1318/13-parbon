'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FestivalContext } from '@/context/FestivalContext';
import type { Festival } from '@/lib/types';
import { CheckCircle, Calendar, ArrowRight, Loader2 } from 'lucide-react';

const FESTIVAL_META: Record<
  string,
  { emoji: string; gradient: string; border: string; btnClass: string; desc: string }
> = {
  'durga-puja-2026': {
    emoji: '🌸',
    gradient: 'from-amber-900/40 to-orange-900/20',
    border: 'border-amber-500/40',
    btnClass: 'bg-amber-500 hover:bg-amber-400 text-black',
    desc: 'The grandest celebration of West Bengal — five days of art, devotion, and community across Kolkata.',
  },
  'kali-puja-2026': {
    emoji: '🌙',
    gradient: 'from-red-900/40 to-purple-900/20',
    border: 'border-red-500/40',
    btnClass: 'bg-red-600 hover:bg-red-500 text-white',
    desc: 'The night of the goddess — Kali Puja celebrated with devotion, fireworks, and lights across Bengal.',
  },
};

export default function SelectFestivalPage() {
  const { festivals, selectedFestival, setSelectedFestival, isLoading } =
    useContext(FestivalContext);
  const router = useRouter();

  const handleSelect = (festival: Festival) => {
    setSelectedFestival(festival);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🎊</div>
          <h1 className="text-4xl font-extrabold gold-text mb-2">Choose Your Festival</h1>
          <p className="text-gray-400">
            Select a festival to personalize your PUJA GUIDE experience
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-amber-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {festivals.map((festival) => {
              const meta = FESTIVAL_META[festival.slug] ?? {
                emoji: '🎉',
                gradient: 'from-gray-800 to-gray-900',
                border: 'border-gray-600',
                btnClass: 'bg-gray-600 text-white',
                desc: festival.description ?? '',
              };
              const isActive = selectedFestival?.id === festival.id;
              const start = new Date(festival.startDate);
              const end = new Date(festival.endDate);

              return (
                <div
                  key={festival.id}
                  className={`relative bg-gradient-to-br ${meta.gradient} border-2 ${
                    isActive ? meta.border : 'border-white/10'
                  } rounded-2xl p-6 transition-all`}
                >
                  {isActive && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                      <CheckCircle size={14} /> Active
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{meta.emoji}</span>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1">{festival.name}</h2>
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
                        <Calendar size={13} />
                        {start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        {' – '}
                        {end.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{meta.desc}</p>
                      <button
                        onClick={() => handleSelect(festival)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${meta.btnClass}`}
                      >
                        {isActive ? '✓ Currently Selected' : 'Select This Festival'}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
