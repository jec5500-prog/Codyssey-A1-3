'use client';

import React, { useState } from 'react';
import { MapPin, Calendar, Bookmark, Eye, Tag } from 'lucide-react';
import { Spot } from '@/lib/types';
import VerificationBadge from '../common/VerificationBadge';
import { toggleSaveSpot } from '@/lib/services/dbService';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  translateCategory,
  translateCity,
  translateCountry,
  translateAttribute,
  translateDescription,
  formatDate,
} from '@/lib/i18n/translationUtils';
import { extractColorProportionsFromImage } from '@/lib/utils/colorExtractor';

interface SpotCardProps {
  spot: Spot;
  onSelect: (spot: Spot) => void;
  isSavedInitial?: boolean;
}

export default function SpotCard({ spot, onSelect, isSavedInitial = false }: SpotCardProps) {
  const { t, language } = useLanguage();
  const [saved, setSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  // Directly preserve and display complete 4-color palette attributes (Turquoise, Teal, Black, White)
  const cardColors =
    spot.attributes?.colors && spot.attributes.colors.length > 0
      ? spot.attributes.colors.slice(0, 4)
      : ['#2EC4B6', '#00A896', '#18181B', '#E5E5E5'];

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaving(true);
    const newState = await toggleSaveSpot(spot.id);
    setSaved(newState);
    setSaving(false);
  };

  const capturedDateStr = formatDate(spot.captured_at, language);
  const localizedCategory = translateCategory(spot.category, language);
  const localizedCity = translateCity(spot.city, language);
  const localizedCountry = translateCountry(spot.country, language);

  return (
    <div
      onClick={() => onSelect(spot)}
      className="group relative bg-[#18181b] rounded-2xl overflow-hidden border border-zinc-800/90 hover:border-orange-500/80 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/50 cursor-pointer flex flex-col justify-between"
    >
      {/* Image & Overlay Header */}
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121214]">
          <img
            src={spot.image_url}
            alt={spot.brand || spot.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/30 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-1 rounded-xl bg-[#121214]/90 backdrop-blur-md border border-orange-500/50 text-[11px] font-extrabold text-orange-300 shadow-md">
              {localizedCategory}
            </span>
            <div className="flex items-center gap-1.5">
              <VerificationBadge isVerified={spot.is_verified} size="sm" />
              <button
                onClick={handleBookmark}
                disabled={saving}
                aria-label={saved ? 'Remove Bookmark' : 'Bookmark to Saved Collection'}
                className={`min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl backdrop-blur-md border transition-all ${
                  saved
                    ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/40'
                    : 'bg-[#121214]/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                }`}
                title={saved ? 'Remove Bookmark' : 'Bookmark to Saved Collection'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Location & Date Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-1.5 bg-[#121214]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-zinc-800 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="font-bold text-white text-xs">{localizedCity}</span>
              <span className="text-zinc-400 text-[11px]">, {localizedCountry}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-300 text-[10px] font-mono bg-[#121214]/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-zinc-800/80">
              <Calendar className="w-3 h-3 text-zinc-400" />
              <span>{capturedDateStr}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Brand & Style Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                {spot.brand || 'Unbranded Spatial Design'}
              </h3>
            </div>
            {spot.attributes?.style && (
              <div className="inline-block">
                <span className="text-[10px] font-extrabold text-orange-300 px-2.5 py-0.5 rounded-lg bg-orange-950/70 border border-orange-800/60 uppercase tracking-wider">
                  {translateAttribute(spot.attributes.style, language)}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-normal">
            {translateDescription(spot.description, language)}
          </p>

          {/* Structured Spatial Attributes Box */}
          {spot.attributes && (
            <div className="bg-[#121214] border border-zinc-800/90 rounded-xl p-2.5 space-y-2">
              {/* Color Palette (Real-time Extracted Image Colors) */}
              {cardColors && cardColors.length > 0 && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                    {language === 'ko' ? '컬러 팔레트' : language === 'ja' ? 'パレット' : language === 'fr' ? 'Palette' : 'Palette'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {cardColors.slice(0, 4).map((hex, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-xs hover:scale-110 transition-transform"
                        style={{ backgroundColor: hex }}
                        title={`Hex: ${hex}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Material Tags */}
              {spot.attributes.materials && spot.attributes.materials.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-zinc-800/80">
                  {spot.attributes.materials.slice(0, 2).map((mat, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-200 bg-zinc-800/90 border border-zinc-700/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                      <span className="truncate max-w-[130px]">{translateAttribute(mat, language)}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-zinc-800/80 text-xs font-bold text-orange-400 group-hover:text-orange-300">
        <span className="text-[11px] text-zinc-500 font-mono">
          {spot.is_verified ? 'Verified Spot' : 'AI Spot'}
        </span>
        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          {t('viewDetails')}
          <Eye className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
