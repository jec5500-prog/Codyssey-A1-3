'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Compass } from 'lucide-react';
import { Spot } from '@/lib/types';
import { getSavedSpots } from '@/lib/services/dbService';
import SpotCard from '../explore/SpotCard';
import SpotDetailModal from '../explore/SpotDetailModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function SavedGallery() {
  const { t, language } = useLanguage();
  const [savedItems, setSavedItems] = useState<{ spot: Spot; collection: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCollection, setActiveCollection] = useState<string>('All');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    async function loadSaves() {
      setLoading(true);
      const items = await getSavedSpots();
      setSavedItems(items);
      setLoading(false);
    }
    loadSaves();
  }, []);

  const collections = Array.from(new Set(savedItems.map((item) => item.collection)));

  const filteredItems = savedItems.filter(
    (item) => activeCollection === 'All' || item.collection === activeCollection
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          Personal Design Library
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('savedTitle')}
        </h1>
        <p className="text-sm text-zinc-400">
          {t('savedDesc')}
        </p>
      </div>

      {/* Collection Pills */}
      {collections.length > 0 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCollection('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCollection === 'All'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {language === 'ko' ? `전체 저장목록 (${savedItems.length})` : language === 'ja' ? `すべての保存 (${savedItems.length})` : language === 'fr' ? `Tous Enregistrés (${savedItems.length})` : `All Saved (${savedItems.length})`}
          </button>
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setActiveCollection(col)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCollection === col
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="p-12 text-center text-zinc-500 bg-zinc-900/50 rounded-3xl border border-zinc-800">
          {language === 'ko' ? '저장된 공간을 불러오는 중입니다...' : 'Loading saved spatial spots...'}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && savedItems.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t('noSavedTitle')}</h3>
            <p className="text-xs text-zinc-400 mt-1">
              {t('noSavedDesc')}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>{t('navExplore')}</span>
          </Link>
        </div>
      )}

      {/* GRID VIEW */}
      {!loading && savedItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(({ spot }) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              isSavedInitial={true}
              onSelect={(s) => setSelectedSpot(s)}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSpot && (
        <SpotDetailModal
          spot={selectedSpot}
          isSavedInitial={true}
          onClose={() => setSelectedSpot(null)}
          onSpotUpdated={(updated) => {
            setSavedItems((prev) =>
              prev.map((item) => (item.spot.id === updated.id ? { ...item, spot: updated } : item))
            );
            setSelectedSpot(updated);
          }}
          onSpotDeleted={(deletedId) => {
            setSavedItems((prev) => prev.filter((item) => item.spot.id !== deletedId));
            setSelectedSpot(null);
          }}
        />
      )}
    </div>
  );
}
