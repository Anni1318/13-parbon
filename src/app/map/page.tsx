'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function MapPage() {
  return (
    <div className="absolute inset-0 top-[64px] z-0 overflow-hidden bg-gray-100">
      <Map />
    </div>
  );
}
