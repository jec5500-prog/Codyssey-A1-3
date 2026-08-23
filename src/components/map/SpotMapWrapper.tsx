'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Spot } from '@/lib/types';

interface SpotMapWrapperProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  initialLat?: number;
  initialLng?: number;
  initialSpotId?: string | null;
}

const DynamicSpotMap = dynamic(() => import('./SpotMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[700px] bg-zinc-950 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center gap-3 text-zinc-500 animate-pulse">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
      <span className="text-xs font-mono">Initializing Spatial Map...</span>
    </div>
  ),
});

export default function SpotMapWrapper(props: SpotMapWrapperProps) {
  return <DynamicSpotMap {...props} />;
}
