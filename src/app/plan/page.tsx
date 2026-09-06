'use client';

import { useState, useContext, useEffect } from 'react';
import { FestivalContext } from '@/context/FestivalContext';
import { Plus, Trash2, GripVertical, MapPin, Clock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Pandal } from '@/lib/types';

interface TourStop {
  id: string;
  pandal: Pandal;
  visitTime: string;
  notes: string;
}

export default function PlanPage() {
  const { selectedFestival } = useContext(FestivalContext);
  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stops, setStops] = useState<TourStop[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedPandalId, setSelectedPandalId] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('tour_itinerary');
    if (saved) {
      try {
        setStops(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved itinerary', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tour_itinerary', JSON.stringify(stops));
    }
  }, [stops, isClient]);

  useEffect(() => {
    const slug = selectedFestival?.slug ?? 'durga-puja-2026';
    fetch(`/api/pandals?festival=${slug}`)
      .then((r) => r.json())
      .then((data: Pandal[]) => {
        setPandals(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedFestival]);

  const addStop = () => {
    const pandal = pandals.find((p) => p.id === selectedPandalId);
    if (!pandal) return;
    setStops((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2),
        pandal,
        visitTime,
        notes,
      },
    ]);
    setSelectedPandalId('');
    setVisitTime('');
    setNotes('');
  };

  const removeStop = (id: string) => setStops((p) => p.filter((s) => s.id !== id));

  const totalTime = stops.length * 30;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-1">🗺️ Plan Your Tour</h1>
          <p className="text-gray-400 text-sm">
            Build your personal pandal-hopping itinerary for {selectedFestival?.name ?? 'Durga Puja 2026'}
          </p>
        </div>

        {/* Add Stop Form */}
        <div className="bg-[#1F2937] border border-amber-500/10 rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-amber-400 mb-4 text-sm uppercase tracking-wider">
            + Add a Stop
          </h2>
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" /> Loading pandals...
            </div>
          ) : (
            <div className="space-y-3">
              <select
                value={selectedPandalId}
                onChange={(e) => setSelectedPandalId(e.target.value)}
                className="w-full bg-black/30 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
              >
                <option value="">Select a pandal...</option>
                {pandals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.area}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="bg-black/30 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
                  placeholder="Visit time"
                />
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  className="bg-black/30 border border-amber-500/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
              <button
                onClick={addStop}
                disabled={!selectedPandalId}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all"
              >
                <Plus size={16} /> Add to Itinerary
              </button>
            </div>
          )}
        </div>

        {/* Itinerary */}
        {stops.length === 0 ? (
          <div className="text-center py-16 bg-[#1F2937] border border-amber-500/5 rounded-2xl text-gray-500">
            <MapPin size={32} className="mx-auto mb-3 opacity-30" />
            <p>Your itinerary is empty.</p>
            <p className="text-sm mt-1">Add your first pandal stop above.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">
                Your Itinerary
                <span className="text-gray-500 font-normal text-sm ml-2">
                  ({stops.length} stops · ~{totalTime} min)
                </span>
              </h2>
              <button
                onClick={() => setStops([])}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            <ol className="space-y-3 mb-6">
              {stops.map((stop, i) => (
                <li key={stop.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    {i < stops.length - 1 && (
                      <div className="w-px flex-1 bg-amber-500/20 my-1 min-h-[24px]" />
                    )}
                  </div>
                  <div className="flex-1 bg-[#1F2937] border border-amber-500/10 rounded-xl p-4 mb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-white text-sm">{stop.pandal.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          <MapPin size={10} />
                          {stop.pandal.area}, {stop.pandal.zone}
                          {stop.visitTime && (
                            <>
                              <span className="text-gray-600">·</span>
                              <Clock size={10} />
                              {stop.visitTime}
                            </>
                          )}
                        </div>
                        {stop.notes && (
                          <p className="text-xs text-gray-500 mt-1">{stop.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/map"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 font-bold rounded-xl transition-all text-sm"
              >
                View on Map <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => {
                  const text = stops
                    .map(
                      (s, i) =>
                        `${i + 1}. ${s.pandal.name}${s.visitTime ? ` @ ${s.visitTime}` : ''}${s.notes ? ` (${s.notes})` : ''}`
                    )
                    .join('\n');
                  navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 font-semibold rounded-xl transition-all text-sm"
              >
                📋 Copy Plan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
