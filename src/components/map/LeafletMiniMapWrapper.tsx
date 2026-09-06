'use client';
import dynamic from 'next/dynamic';
const LeafletMiniMap = dynamic(() => import('./LeafletMiniMap'), { ssr: false });
export default LeafletMiniMap;
