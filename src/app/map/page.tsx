'use client';

import dynamic from 'next/dynamic';
import { APIProvider } from '@vis.gl/react-google-maps';

const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 text-center p-6">
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-full border-4 border-amber-200 border-t-amber-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xl">🪔</div>
      </div>
      <h2 className="text-base font-bold text-gray-900">Loading Kolkata Puja Map...</h2>
      <p className="text-xs text-gray-500 mt-1">Initializing Google Maps & Pandal Directory</p>
    </div>
  )
});

export default function MapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="absolute inset-0 top-[64px] z-0 overflow-hidden bg-gray-100">
      <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
        <Map />
      </APIProvider>
    </div>
  );
}
