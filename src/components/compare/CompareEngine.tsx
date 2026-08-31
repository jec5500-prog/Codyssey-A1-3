'use client';

import React, { useState, useEffect } from 'react';
import { Scale, MapPin, Sparkles, Check, ArrowRight, Tag } from 'lucide-react';
import { SpotCategory, ComparisonMetrics, Spot } from '@/lib/types';
import { getComparisonMetrics } from '@/lib/services/dbService';
import SpotCard from '../explore/SpotCard';
import SpotDetailModal from '../explore/SpotDetailModal';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  translateCategory,
  translateCity,
  translateCountry,
  translateAttribute,
  formatCompareSummary,
  translateCommonTrait,
  translateKeyDifference,
  formatSpotCountText,
} from '@/lib/i18n/translationUtils';

interface CompareEngineProps {
  availableLocations: string[];
}

export default function CompareEngine({ availableLocations }: CompareEngineProps) {
  const { t, language } = useLanguage();
  const [entityA, setEntityA] = useState<string>('Tokyo');
  const [entityB, setEntityB] = useState<string>('Paris');
  const [category, setCategory] = useState<SpotCategory | 'All'>('All');
  const [metrics, setMetrics] = useState<ComparisonMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      const res = await getComparisonMetrics(entityA, entityB, category);
      setMetrics(res);
      setLoading(false);
    }
    loadMetrics();
  }, [entityA, entityB, category]);

  const categories: (SpotCategory | 'All')[] = [
    'All',
    'Window',
    'Store Interior',
    'Store Exterior',
    'Pop-up Store',
    'Exhibition',
  ];

  const formatLocName = (loc: string) => {
    const cityTr = translateCity(loc, language);
    if (cityTr !== loc) return cityTr;
    const countryTr = translateCountry(loc, language);
    return countryTr;
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-800 text-orange-300 text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          {t('dualMatrix')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('compareTitle')}
        </h1>
        <p className="text-sm text-zinc-400">
          {t('compareDesc')}
        </p>
      </div>

      {/* Control Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Location A */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              {t('locationA')}
            </label>
            <select
              value={entityA}
              onChange={(e) => setEntityA(e.target.value)}
              className="w-full bg-zinc-950 text-orange-300 font-bold text-base px-4 py-3 rounded-2xl border border-zinc-800 focus:border-orange-500 focus:outline-none cursor-pointer"
            >
              {availableLocations.map((loc) => (
                <option key={loc} value={loc} disabled={loc === entityB}>
                  {formatLocName(loc)}
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider Icon */}
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center font-black text-xs text-zinc-400 shadow-inner">
              VS
            </div>
          </div>

          {/* Location B */}
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              {t('locationB')}
            </label>
            <select
              value={entityB}
              onChange={(e) => setEntityB(e.target.value)}
              className="w-full bg-zinc-950 text-amber-300 font-bold text-base px-4 py-3 rounded-2xl border border-zinc-800 focus:border-amber-500 focus:outline-none cursor-pointer"
            >
              {availableLocations.map((loc) => (
                <option key={loc} value={loc} disabled={loc === entityA}>
                  {formatLocName(loc)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-3 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-zinc-500 font-semibold uppercase mr-2 shrink-0">{t('spatialCategory')}:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {translateCategory(cat, language)}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING STATE MATRIX */}
      {loading && (
        <div className="w-full py-20 flex items-center justify-center text-sm text-zinc-400 bg-zinc-900/50 rounded-3xl border border-zinc-800 font-medium">
          {t('analyzingMatrix')}
        </div>
      )}

      {/* COMPARISON RESULTS MATRIX */}
      {!loading && metrics && (
        <div className="space-y-8">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-amber-950/40 border border-zinc-800 p-6 rounded-3xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              {t('summaryTitle')}
            </h3>
            <p className="text-sm text-zinc-200 leading-relaxed font-medium">{formatCompareSummary(metrics, language)}</p>
          </div>

          {/* Dominant Materials Comparison Bars */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entity A Materials */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-orange-300">{formatLocName(metrics.entityA.name)}</h3>
                  <p className="text-xs text-zinc-400">{formatSpotCountText(metrics.entityA.count, language)}</p>
                </div>
                <Tag className="w-5 h-5 text-orange-400" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase">{t('topMaterials')}</p>
                {metrics.entityA.topMaterials.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">{t('noMaterialData')}</p>
                ) : (
                  metrics.entityA.topMaterials.map((mat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-zinc-200">
                        <span>{translateAttribute(mat.name, language)}</span>
                        <span className="font-mono text-orange-400">{mat.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${mat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Color Swatches */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t('dominantColors')}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {metrics.entityA.topColors.map((col, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800">
                      <span className="w-4 h-4 rounded-full border border-zinc-700 shadow-sm" style={{ backgroundColor: col.hex }} />
                      <span className="font-mono text-xs text-zinc-300">{col.hex}</span>
                      <span className="text-xs text-zinc-500 font-bold">({col.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Entity B Materials */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="font-bold text-lg text-amber-300">{formatLocName(metrics.entityB.name)}</h3>
                  <p className="text-xs text-zinc-400">{formatSpotCountText(metrics.entityB.count, language)}</p>
                </div>
                <Tag className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-zinc-400 uppercase">{t('topMaterials')}</p>
                {metrics.entityB.topMaterials.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">{t('noMaterialData')}</p>
                ) : (
                  metrics.entityB.topMaterials.map((mat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-zinc-200">
                        <span>{translateAttribute(mat.name, language)}</span>
                        <span className="font-mono text-amber-400">{mat.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${mat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Color Swatches */}
              <div className="pt-2 border-t border-zinc-800">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-2">{t('dominantColors')}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {metrics.entityB.topColors.map((col, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800">
                      <span className="w-4 h-4 rounded-full border border-zinc-700 shadow-sm" style={{ backgroundColor: col.hex }} />
                      <span className="font-mono text-xs text-zinc-300">{col.hex}</span>
                      <span className="text-xs text-zinc-500 font-bold">({col.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Qualitative Synthesis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Commonalities */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4" />
                {t('commonTraits')}
              </h4>
              <div className="space-y-2">
                {metrics.commonTraits.map((trait, i) => (
                  <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{translateCommonTrait(trait, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Differences */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                {t('keyDifferences')}
              </h4>
              <div className="space-y-2">
                {metrics.keyDifferences.map((diff, i) => (
                  <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs text-zinc-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{translateKeyDifference(diff, metrics.entityA.name, metrics.entityB.name, metrics.entityA.topMaterials[0]?.name || '', metrics.entityB.topMaterials[0]?.name || '', language)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Representative Spots Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              {t('representativeCases')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.entityA.representativeSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} onSelect={(s) => setSelectedSpot(s)} />
              ))}
              {metrics.entityB.representativeSpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} onSelect={(s) => setSelectedSpot(s)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spot Detail Modal */}
      {selectedSpot && (
        <SpotDetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}
