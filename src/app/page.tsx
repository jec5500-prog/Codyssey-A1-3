'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Compass, MapPin, Scale, Sparkles } from 'lucide-react';
import { Spot, SpotCategory } from '@/lib/types';
import { getSpots } from '@/lib/services/dbService';
import FilterBar from '@/components/explore/FilterBar';
import SpotCard from '@/components/explore/SpotCard';
import SpotDetailModal from '@/components/explore/SpotDetailModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ExplorePage() {
  const { t, language } = useLanguage();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  // Filters
  const [category, setCategory] = useState<SpotCategory | 'All'>('All');
  const [country, setCountry] = useState<string>('All');
  const [city, setCity] = useState<string>('All');
  const [year, setYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isVerifiedOnly, setIsVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'confidence'>('latest');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 9; // 3 columns x 3 rows = 9 spots per view

  // Load spots
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getSpots({
        country,
        city,
        category,
        year,
        searchQuery,
        isVerifiedOnly,
        sortBy,
      });
      setSpots(data);
      setCurrentPage(1);
      setLoading(false);
    }
    loadData();
  }, [category, country, city, year, searchQuery, isVerifiedOnly, sortBy]);

  // Derived filter options
  const allSpotsRef = React.useRef<Spot[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAllForFilters() {
      const all = await getSpots();
      allSpotsRef.current = all;
      setAllCountries(Array.from(new Set(all.map((s) => s.country))));
      const years = Array.from(
        new Set(all.map((s) => (s.captured_at ? s.captured_at.slice(0, 4) : '')).filter(Boolean))
      ).sort((a, b) => b.localeCompare(a));
      setAllYears(years);
    }
    fetchAllForFilters();
  }, []);

  useEffect(() => {
    if (country === 'All') {
      setAllCities(Array.from(new Set(allSpotsRef.current.map((s) => s.city))));
    } else {
      setAllCities(
        Array.from(
          new Set(
            allSpotsRef.current
              .filter((s) => s.country.toLowerCase() === country.toLowerCase())
              .map((s) => s.city)
          )
        )
      );
    }
  }, [country]);

  const verifiedCount = spots.filter((s) => s.is_verified).length;
  const totalPages = Math.ceil(spots.length / ITEMS_PER_PAGE);
  const visibleSpots = spots.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8 text-white">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#18181b] via-[#18181b] to-orange-950/50 border border-zinc-800 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-800/80 text-orange-300 text-xs font-bold shadow-md shadow-orange-950/50">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Global Spatial Design Intelligence Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t('exploreTitle')}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
            {t('exploreDesc')}
          </p>
        </div>

        {/* Enhanced Core Workflow Pipeline Interactive Bar (Full-Width Spanning Grid) */}
        <div className="pt-6 w-full border-t border-zinc-800/80 mt-6">
          <div className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-orange-400 font-extrabold">SPOT Core Spatial Workflow</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">4-Step Intelligence Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Step 1: Capture */}
            <Link
              href="/capture"
              className="group relative bg-[#121214]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/80 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-orange-950/40 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-800/80 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shadow-md">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-extrabold text-zinc-400 group-hover:text-orange-400">
                  STEP 01
                </span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-white group-hover:text-orange-300 transition-colors flex items-center justify-between mb-1">
                  <span>1. {t('navCapture')}</span>
                  <span className="text-orange-500 group-hover:translate-x-1 transition-transform font-bold">→</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  {language === 'ko' ? '현장 공간 촬영 및 AI 자동 속성 추출' : 'Capture Spatial Photos & AI Attributes'}
                </p>
              </div>
            </Link>

            {/* Step 2: Explore (Current Active Page) */}
            <div className="relative bg-gradient-to-br from-orange-950/50 via-[#121214] to-amber-950/40 border-2 border-orange-500 p-5 rounded-2xl shadow-xl shadow-orange-950/50 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/50 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                  <span>ACTIVE</span>
                </span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-orange-300 flex items-center justify-between mb-1">
                  <span>2. {t('navExplore')}</span>
                  <span className="text-xs font-mono font-bold text-orange-400">CURRENT</span>
                </div>
                <p className="text-xs text-zinc-300 font-medium">
                  {language === 'ko' ? '글로벌 공간 DB 다차원 스마트 탐색' : 'Global Spatial DB Smart Exploration'}
                </p>
              </div>
            </div>

            {/* Step 3: Compare */}
            <Link
              href="/compare"
              className="group relative bg-[#121214]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/80 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-orange-950/40 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-800/80 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shadow-md">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-extrabold text-zinc-400 group-hover:text-orange-400">
                  STEP 03
                </span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-white group-hover:text-orange-300 transition-colors flex items-center justify-between mb-1">
                  <span>3. {t('navCompare')}</span>
                  <span className="text-orange-500 group-hover:translate-x-1 transition-transform font-bold">→</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  {language === 'ko' ? '도시/브랜드 교차 데이터 비교 분석' : 'City & Brand Cross-Data Comparison'}
                </p>
              </div>
            </Link>

            {/* Step 4: Insight */}
            <Link
              href="/insight"
              className="group relative bg-[#121214]/90 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/80 p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-amber-950/40 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-extrabold text-zinc-400 group-hover:text-amber-400">
                  STEP 04
                </span>
              </div>
              <div>
                <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center justify-between mb-1">
                  <span>4. {t('navInsight')}</span>
                  <span className="text-amber-500 group-hover:translate-x-1 transition-transform font-bold">→</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  {language === 'ko' ? 'VMD & 공간 지능 AI 리포트 생성' : 'VMD & Spatial AI Report Generator'}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Floating Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
              {t('totalSpots')}
            </span>
            <span className="text-xl font-extrabold text-white font-mono">{spots.length}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
              Global Hub Cities
            </span>
            <span className="text-xl font-extrabold text-orange-400 font-mono">
              {allCities.length > 0 ? allCities.length : 6}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
              Human Verified Ratio
            </span>
            <span className="text-xl font-extrabold text-emerald-400 font-mono">
              {spots.length > 0 ? Math.round((verifiedCount / spots.length) * 100) : 100}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
              Map Pins Active
            </span>
            <Link
              href="/map"
              className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1 mt-1"
            >
              <MapPin className="w-3.5 h-3.5" />
              {t('openOnMap')}
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-facet Filter Bar */}
      <FilterBar
        category={category}
        onCategoryChange={setCategory}
        country={country}
        onCountryChange={setCountry}
        city={city}
        onCityChange={setCity}
        year={year}
        onYearChange={setYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isVerifiedOnly={isVerifiedOnly}
        onVerifiedOnlyChange={setIsVerifiedOnly}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        availableCountries={allCountries}
        availableCities={allCities}
        availableYears={allYears}
        totalResults={spots.length}
      />

      {/* Spots Grid View: 3 items per row, 3 rows = 9 spots per grid page */}
      {loading && (
        <div className="p-16 text-center text-zinc-500 bg-[#18181b]/80 rounded-3xl border border-zinc-800 animate-pulse font-medium">
          Fetching structured spatial design records...
        </div>
      )}

      {!loading && spots.length === 0 && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#121214] border border-orange-800/60 flex items-center justify-center text-orange-400 mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Spatial Spots Found</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try adjusting your category pills, city filters, or search terms.
            </p>
          </div>
        </div>
      )}

      {!loading && visibleSpots.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleSpots.map((spot) => (
              <SpotCard
                key={spot.id}
                spot={spot}
                onSelect={(s) => setSelectedSpot(s)}
              />
            ))}
          </div>

          {/* 3x3 Grid Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80 bg-[#18181b]/60 p-4 rounded-2xl border">
              <span className="text-xs font-semibold text-zinc-400">
                Displaying <strong className="text-white font-mono">{visibleSpots.length}</strong> of{' '}
                <strong className="text-orange-400 font-mono">{spots.length}</strong> spots (3×3 grid, Page{' '}
                <strong className="text-white font-mono">{currentPage}</strong> / {totalPages})
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-[#121214] border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:border-orange-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all ${
                      pg === currentPage
                        ? 'bg-orange-500 text-white border border-orange-400 shadow-md shadow-orange-500/30'
                        : 'bg-[#121214] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-xl bg-[#121214] border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:border-orange-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSpot && (
        <SpotDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
          onSpotUpdated={(updated) => {
            setSpots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            setSelectedSpot(updated);
          }}
          onSpotDeleted={(deletedId) => {
            setSpots((prev) => prev.filter((s) => s.id !== deletedId));
            setSelectedSpot(null);
          }}
        />
      )}
    </div>
  );
}
