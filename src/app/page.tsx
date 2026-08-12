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
  const { t } = useLanguage();
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

          {/* Core Workflow Pipeline Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/capture"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <Camera className="w-4 h-4" />
              <span>1. {t('navCapture')}</span>
            </Link>
            <span className="text-zinc-600 font-bold">→</span>
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-orange-300 font-bold shadow-xs">
              <Compass className="w-4 h-4 text-orange-400" />
              <span>2. {t('navExplore')}</span>
            </div>
            <span className="text-zinc-600 font-bold">→</span>
            <Link
              href="/compare"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121214] border border-zinc-800 text-zinc-300 hover:text-white font-bold transition-all"
            >
              <Scale className="w-4 h-4 text-orange-400" />
              <span>3. {t('navCompare')}</span>
            </Link>
            <span className="text-zinc-600 font-bold">→</span>
            <Link
              href="/insight"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121214] border border-zinc-800 text-zinc-300 hover:text-white font-bold transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>4. {t('navInsight')}</span>
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

      {/* Spots Grid View */}
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

      {!loading && spots.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {spots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              onSelect={(s) => setSelectedSpot(s)}
            />
          ))}
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
