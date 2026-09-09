import type { Pandal } from './types';

export interface TourStop {
  id: string;
  pandal: Pandal;
  visitTime: string;
  notes: string;
}

const STORAGE_KEY = 'tour_itinerary';

export function getTourStops(): TourStop[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to read tour itinerary', e);
    return [];
  }
}

export function isPandalInTour(pandalIdOrSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  const stops = getTourStops();
  return stops.some(
    (s) => s.pandal?.id === pandalIdOrSlug || s.pandal?.slug === pandalIdOrSlug
  );
}

export function addToTour(pandal: Pandal, visitTime = '', notes = ''): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stops = getTourStops();
    if (stops.some((s) => s.pandal?.id === pandal.id)) {
      return false;
    }
    const newStop: TourStop = {
      id: Math.random().toString(36).slice(2, 11),
      pandal,
      visitTime,
      notes,
    };
    stops.push(newStop);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stops));
    window.dispatchEvent(new CustomEvent('tour_itinerary_updated', { detail: { action: 'add', pandalId: pandal.id } }));
    return true;
  } catch (e) {
    console.error('Failed to add to tour', e);
    return false;
  }
}

export function removeFromTour(pandalIdOrSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stops = getTourStops();
    const filtered = stops.filter(
      (s) => s.pandal?.id !== pandalIdOrSlug && s.pandal?.slug !== pandalIdOrSlug
    );
    if (filtered.length !== stops.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('tour_itinerary_updated', { detail: { action: 'remove', pandalId: pandalIdOrSlug } }));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to remove from tour', e);
    return false;
  }
}

export function toggleTourStop(pandal: Pandal): boolean {
  if (isPandalInTour(pandal.id) || (pandal.slug && isPandalInTour(pandal.slug))) {
    removeFromTour(pandal.id);
    return false; // now removed
  } else {
    addToTour(pandal);
    return true; // now added
  }
}
