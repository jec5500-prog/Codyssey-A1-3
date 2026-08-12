'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spot } from '@/lib/types';
import { getSpots } from '@/lib/services/dbService';
import SpotMapWrapper from '@/components/map/SpotMapWrapper';
import SpotDetailModal from '@/components/explore/SpotDetailModal';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function MapContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const latParam = searchParams.get('lat');
  const lngParam = searchParams.get('lng');
  const spotIdParam = searchParams.get('spotId');

  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getSpots();
      setSpots(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const initialLat = latParam ? parseFloat(latParam) : undefined;
  const initialLng = lngParam ? parseFloat(lngParam) : undefined;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            {t('navMap')}
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            {t('mapTitle')}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {t('mapSubtitle')}
          </p>
        </div>
      </div>

      {/* Map View */}
      {loading ? (
        <div className="w-full h-[700px] bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center text-zinc-500">
          {t('loadingMap')}
        </div>
      ) : (
        <SpotMapWrapper
          spots={spots}
          onSelectSpot={(spot) => setSelectedSpot(spot)}
          initialLat={initialLat}
          initialLng={initialLng}
          initialSpotId={spotIdParam}
        />
      )}

      {/* Detail Modal */}
      {selectedSpot && (
        <SpotDetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-zinc-500">Loading Map...</div>}>
      <MapContent />
    </Suspense>
  );
}
