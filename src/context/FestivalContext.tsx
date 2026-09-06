'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Festival, FestivalCalendarDay } from '@/lib/types';

interface FestivalContextValue {
  selectedFestival: Festival | null;
  setSelectedFestival: (festival: Festival) => void;
  festivals: Festival[];
  calendarDays: FestivalCalendarDay[];
  isLoading: boolean;
}

export const FestivalContext = createContext<FestivalContextValue>({
  selectedFestival: null,
  setSelectedFestival: () => {},
  festivals: [],
  calendarDays: [],
  isLoading: true,
});

export function FestivalProvider({ children }: { children: React.ReactNode }) {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFestival, setSelectedFestivalState] = useState<Festival | null>(null);
  const [calendarDays, setCalendarDays] = useState<FestivalCalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/festivals')
      .then((r) => r.json())
      .then((data: Festival[]) => {
        setFestivals(data);
        const savedSlug =
          typeof window !== 'undefined' ? localStorage.getItem('selectedFestivalSlug') : null;
        const saved = savedSlug ? data.find((f) => f.slug === savedSlug) : null;
        const defaultFestival =
          saved ?? data.find((f) => f.slug === 'durga-puja-2026') ?? data[0];
        if (defaultFestival) {
          setSelectedFestivalState(defaultFestival);
          setCalendarDays(defaultFestival.calendarDays ?? []);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const setSelectedFestival = useCallback((festival: Festival) => {
    setSelectedFestivalState(festival);
    setCalendarDays(festival.calendarDays ?? []);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedFestivalSlug', festival.slug);
    }
  }, []);

  return (
    <FestivalContext.Provider
      value={{ selectedFestival, setSelectedFestival, festivals, calendarDays, isLoading }}
    >
      {children}
    </FestivalContext.Provider>
  );
}

export function useFestival() {
  return useContext(FestivalContext);
}
