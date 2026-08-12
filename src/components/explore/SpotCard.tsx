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

interface SpotCardProps {
  spot: Spot;
  onSelect: (spot: Spot) => void;
  isSavedInitial?: boolean;
}

export default function SpotCard({ spot, onSelect, isSavedInitial = false }: SpotCardProps) {
  const { t, language } = useLanguage();
  const [saved, setSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

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
      className="group relative bg-[#18181b] rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-orange-500/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-950/40 cursor-pointer flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121214]">
        <img
          src={spot.image_url}
          alt={spot.brand || spot.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-[#121214]/85 backdrop-blur-md border border-orange-800/60 text-xs font-bold text-orange-300">
            {localizedCategory}
          </span>
          <div className="flex items-center gap-2">
            <VerificationBadge isVerified={spot.is_verified} size="sm" />
            <button
              onClick={handleBookmark}
              disabled={saving}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
                saved
                  ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/40'
                  : 'bg-[#121214]/75 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white'
              }`}
              title={saved ? 'Remove Bookmark' : 'Bookmark to Saved Collection'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Overlay Location */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <div className="flex items-center gap-1 bg-[#121214]/85 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-800">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold text-white">{localizedCity}</span>
            <span className="text-zinc-400">, {localizedCountry}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400 text-[11px] bg-[#121214]/85 backdrop-blur-sm px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3 text-zinc-500" />
            <span>{capturedDateStr}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-white group-hover:text-orange-300 transition-colors line-clamp-1">
              {spot.brand || 'Unbranded Spatial Design'}
            </h3>
            {spot.attributes?.style && (
              <span className="text-[11px] font-bold text-orange-300 px-2 py-0.5 rounded bg-orange-950/70 border border-orange-800/50">
                {translateAttribute(spot.attributes.style, language)}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {translateDescription(spot.description, language)}
          </p>
        </div>

        {/* Design Attributes Quick Bar */}
        {spot.attributes && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            {/* Color Swatches */}
            {spot.attributes.colors && spot.attributes.colors.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                  {language === 'ko' ? '컬러 팔레트' : language === 'ja' ? 'パレット' : language === 'fr' ? 'Palette' : 'Palette'}
                </span>
                <div className="flex items-center gap-1">
                  {spot.attributes.colors.slice(0, 4).map((hex, idx) => (
                    <span
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={`Hex: ${hex}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Material Tags */}
            {spot.attributes.materials && spot.attributes.materials.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {spot.attributes.materials.slice(0, 2).map((mat, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-zinc-300 bg-zinc-800/80 border border-zinc-700/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold"
                  >
                    <Tag className="w-2.5 h-2.5 text-orange-400" />
                    <span>{translateAttribute(mat, language)}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-end text-xs font-bold text-orange-400 group-hover:text-orange-300">
          <span className="flex items-center gap-1">
            {t('viewDetails')}
            <Eye className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
