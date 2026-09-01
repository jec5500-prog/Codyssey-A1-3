'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Spot } from '@/lib/types';
import LoadingState from '@/components/common/LoadingState';

interface SpotMapWrapperProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  initialLat?: number;
  initialLng?: number;
  initialSpotId?: string | null;
}

const DynamicSpotMap = dynamic(() => import('./SpotMap'), {
  ssr: false,
  loading: () => <LoadingState variant="container" className="h-[700px]" />,
});

export default function SpotMapWrapper(props: SpotMapWrapperProps) {
  return <DynamicSpotMap {...props} />;
}
