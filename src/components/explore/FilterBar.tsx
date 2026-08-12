'use client';

import React from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { SpotCategory } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translateCategory, translateCountry, translateCity } from '@/lib/i18n/translationUtils';

interface FilterBarProps {
  category: SpotCategory | 'All';
  onCategoryChange: (cat: SpotCategory | 'All') => void;
  country: string;
  onCountryChange: (country: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  year: string;
  onYearChange: (year: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isVerifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
  sortBy: 'latest' | 'oldest' | 'confidence';
  onSortByChange: (sort: 'latest' | 'oldest' | 'confidence') => void;
  availableCountries: string[];
  availableCities: string[];
  availableYears: string[];
  totalResults: number;
}

export default function FilterBar({
  category,
  onCategoryChange,
  country,
  onCountryChange,
  city,
  onCityChange,
  year,
  onYearChange,
  searchQuery,
  onSearchChange,
  isVerifiedOnly,
  onVerifiedOnlyChange,
  sortBy,
  onSortByChange,
  availableCountries,
  availableCities,
  availableYears,
  totalResults,
}: FilterBarProps) {
  const { t, language } = useLanguage();

  const categories: (SpotCategory | 'All')[] = [
    'All',
    'Window',
    'Store Interior',
    'Store Exterior',
    'Pop-up Store',
    'Street',
    'Exhibition',
  ];

  return (
    <div className="bg-[#18181b]/90 border border-zinc-800/80 rounded-2xl p-4 space-y-4 backdrop-blur-md shadow-xl text-white">
      {/* Top Search & Primary Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#121214] text-white placeholder-zinc-500 pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm transition-all font-medium"
          />
        </div>

        {/* Country, City & Year Selectors */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Year Filter Dropdown */}
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-[#121214] text-zinc-200 text-xs py-2.5 px-3 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer"
          >
            <option value="All">{t('allYears')}</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                📅 {y} ({t('yearCaptured')})
              </option>
            ))}
          </select>

          <select
            value={country}
            onChange={(e) => {
              onCountryChange(e.target.value);
              onCityChange('All');
            }}
            className="bg-[#121214] text-zinc-200 text-xs py-2.5 px-3 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer"
          >
            <option value="All">{t('allCountries')}</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {translateCountry(c, language)}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-[#121214] text-zinc-200 text-xs py-2.5 px-3 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer"
          >
            <option value="All">{t('allCities')}</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {translateCity(c, language)}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="bg-[#121214] text-zinc-200 text-xs py-2.5 px-3 rounded-xl border border-zinc-800 focus:border-orange-500 focus:outline-none font-semibold cursor-pointer hidden sm:block"
          >
            <option value="latest">{t('sortLatest')}</option>
            <option value="oldest">{t('sortOldest')}</option>
            <option value="confidence">{t('sortConfidence')}</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Verified Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/30'
                    : 'bg-[#121214] text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {translateCategory(cat, language)}
              </button>
            );
          })}
        </div>

        {/* Right Info & Verified Filter */}
        <div className="flex items-center justify-between lg:justify-end gap-4 text-xs">
          <label className="flex items-center gap-2 text-zinc-300 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isVerifiedOnly}
              onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {t('verifiedData')}
            </span>
          </label>

          <span className="text-zinc-400 font-mono text-[11px]">
            {t('totalSpots')}: <strong className="text-white">{totalResults}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
