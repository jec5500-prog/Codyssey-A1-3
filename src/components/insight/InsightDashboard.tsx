'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertTriangle,
  Camera,
  Layers,
  Palette,
  Sun,
  TrendingUp,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { SpotCategory, SpatialInsightReport } from '@/lib/types';
import { getAIInsightReport } from '@/lib/services/dbService';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  translateCategory,
  translateCountry,
  translateAttribute,
  formatInsightScope,
  translateTakeaway,
  translateMaterialInsight,
  formatStyleShift,
  formatSpotCountText,
} from '@/lib/i18n/translationUtils';

interface InsightDashboardProps {
  availableCountries: string[];
}

export default function InsightDashboard({ availableCountries }: InsightDashboardProps) {
  const { t, language } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | 'All'>('All');
  const [report, setReport] = useState<SpatialInsightReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      const res = await getAIInsightReport({
        country: selectedCountry === 'All' ? undefined : selectedCountry,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
      });
      setReport(res);
      setLoading(false);
    }
    loadReport();
  }, [selectedCountry, selectedCategory]);

  const categories: (SpotCategory | 'All')[] = [
    'All',
    'Window',
    'Store Interior',
    'Store Exterior',
    'Pop-up Store',
    'Exhibition',
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          {t('dbGroundedTitle')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('insightTitle')}
        </h1>
        <p className="text-sm text-zinc-400">
          {t('insightDesc')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase text-zinc-400">{t('reportScope')}:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-zinc-950 text-zinc-200 text-xs py-2 px-3 rounded-xl border border-zinc-800 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="All">{t('allCountries')}</option>
            {availableCountries.map((c) => (
              <option key={c} value={c}>
                {translateCountry(c, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {translateCategory(cat, language)}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-12 text-center text-zinc-500 bg-zinc-900/50 rounded-3xl border border-zinc-800 font-medium">
          {t('analyzingDBRecords')}
        </div>
      )}

      {/* DATA SUFFICIENCY GUARD ALERT (If spotCount < 2) */}
      {!loading && report && !report.isSufficient && (
        <div className="bg-zinc-900 border border-amber-500/50 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
              {t('dataGuardTriggered')}
            </span>
            <h3 className="text-2xl font-extrabold text-white">
              {t('insufficientDataTitle')}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('insufficientDataDesc')}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/capture"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
            >
              <Camera className="w-4 h-4" />
              <span>{t('captureCTA')}</span>
            </Link>
          </div>
        </div>
      )}

      {/* SUFFICIENT DATA REPORT DASHBOARD */}
      {!loading && report && report.isSufficient && (
        <div className="space-y-8">
          {/* Executive Header Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/50 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-orange-400">
                  {formatInsightScope(selectedCountry, selectedCategory, language)}
                </span>
                <h2 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                  {t('trendReportTitle')}
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {formatSpotCountText(report.spotCount, language)}
                </span>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {t('executiveTakeaways')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 text-xs text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    <span>{translateTakeaway(takeaway, report.spotCount, report.materialTrends[0]?.material || '', language)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material & Color Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Material Trends */}
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                {t('materialFrequency')}
              </h3>

              <div className="space-y-4">
                {report.materialTrends.map((mat, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                      <span>{translateAttribute(mat.material, language)}</span>
                      <span className="font-mono text-orange-400">{mat.percentage}% Share</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${mat.percentage}%` }} />
                    </div>
                    <p className="text-xs text-zinc-400 italic">{translateMaterialInsight(mat.insight, language)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Temperature & Palette Distribution */}
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                {t('colorBreakdown')}
              </h3>

              <div className="space-y-3">
                {report.colorPaletteDistribution.map((col, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg border border-zinc-700 shadow-sm" style={{ backgroundColor: col.hex }} />
                      <span className="font-mono text-xs text-zinc-200 font-medium">{col.hex}</span>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-bold">{col.usage}% DB Usage</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Style & Lighting Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Style Distribution */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                {t('styleShare')}
              </h3>
              <div className="space-y-2">
                {report.styleEvolution.map((st, i) => (
                  <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 text-xs">
                    <span className="font-bold text-zinc-200 block">{translateAttribute(st.style, language)}</span>
                    <span className="text-xs text-zinc-400 mt-0.5 block">{formatStyleShift(st.shift, language)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting Ratios */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                {t('lightingDistribution')}
              </h3>
              <div className="space-y-2">
                {report.lightingPreference.map((light, i) => (
                  <div key={i} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-zinc-200">
                      <span>{translateAttribute(light.type, language)}</span>
                      <span className="font-mono text-amber-400">{light.ratio}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${light.ratio}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
