'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  MapPin,
  Calendar,
  User as UserIcon,
  Tag,
  Sparkles,
  Bookmark,
  ExternalLink,
  Layers,
  Palette,
  Sun,
  Box,
  Share2,
  Edit,
  Trash2,
  Save,
  AlertTriangle,
  Upload,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { Spot, SpotCategory } from '@/lib/types';
import VerificationBadge from '../common/VerificationBadge';
import { toggleSaveSpot, updateSpot, deleteSpot } from '@/lib/services/dbService';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  translateCategory,
  translateCity,
  translateCountry,
  translateAttribute,
  translateDescription,
  formatDate,
} from '@/lib/i18n/translationUtils';
import { compressImageFile } from '@/lib/utils/imageCompressor';
import { calculateColorPercentages } from '@/lib/utils/colorExtractor';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
  onSpotUpdated?: (updated: Spot) => void;
  onSpotDeleted?: (id: string) => void;
  isSavedInitial?: boolean;
}

export default function SpotDetailModal({
  spot: initialSpot,
  onClose,
  onSpotUpdated,
  onSpotDeleted,
  isSavedInitial = false,
}: SpotDetailModalProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [spot, setSpot] = useState<Spot | null>(initialSpot);
  const [saved, setSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editBrand, setEditBrand] = useState(initialSpot?.brand || '');
  const [editCategory, setEditCategory] = useState<SpotCategory>(initialSpot?.category || 'Window');
  const [editDescription, setEditDescription] = useState(initialSpot?.description || '');
  const [editCity, setEditCity] = useState(initialSpot?.city || '');
  const [editCountry, setEditCountry] = useState(initialSpot?.country || '');
  const [editStyle, setEditStyle] = useState(initialSpot?.attributes?.style || '');
  const [editImageUrl, setEditImageUrl] = useState(initialSpot?.image_url || '');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Delete State
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!spot) return null;

  // Strict Authorization: Admin or Spot Author ONLY
  const isAdmin = user?.role === 'admin';
  const isAuthor =
    !!user &&
    ((spot.user_id && user.id === spot.user_id) ||
      (spot.user_email && user.email && spot.user_email.toLowerCase() === user.email.toLowerCase()) ||
      (spot.user_name && user.name && spot.user_name === user.name));

  const canModify = isAdmin || isAuthor;

  const handleBookmark = async () => {
    setSaving(true);
    const newState = await toggleSaveSpot(spot.id);
    setSaved(newState);
    setSaving(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Image Upload inside Edit mode
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const compressedBase64 = await compressImageFile(file);
        setEditImageUrl(compressedBase64);
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) setEditImageUrl(ev.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Submit Spot Update
  const handleSaveEdit = async () => {
    setUpdateLoading(true);

    // Extract exact colors from updated image URL
    let newColors = spot.attributes?.colors || ['#18181B', '#F97316'];
    if (editImageUrl && editImageUrl !== spot.image_url) {
      try {
        const { extractDominantColorsFromImage } = await import('@/lib/utils/colorExtractor');
        const extracted = await extractDominantColorsFromImage(editImageUrl, 4);
        if (extracted.length > 0) newColors = extracted;
      } catch (err) {
        console.warn('Color extraction on edit failed:', err);
      }
    }

    const updated = await updateSpot(spot.id, {
      brand: editBrand,
      category: editCategory,
      description: editDescription,
      city: editCity,
      country: editCountry,
      image_url: editImageUrl,
      attributes: spot.attributes
        ? {
            ...spot.attributes,
            spot_id: spot.id,
            style: editStyle,
            colors: newColors,
          }
        : {
            spot_id: spot.id,
            colors: newColors,
            materials: ['Stainless Steel', 'Architectural Glass'],
            style: editStyle,
            lighting: 'Dynamic Spot Accent & Linear Cove',
            composition: 'Monolithic Kinetic Focus',
            objects: ['Retail Display Pods'],
            theme: 'Modern Luxury Identity',
          },
    });

    setUpdateLoading(false);
    if (updated) {
      setSpot(updated);
      setIsEditing(false);
      onSpotUpdated?.(updated);
    }
  };

  // Confirm Spot Deletion
  const handleDeleteSpot = async () => {
    setDeleteLoading(true);
    const success = await deleteSpot(spot.id);
    setDeleteLoading(false);
    if (success) {
      onSpotDeleted?.(spot.id);
      onClose();
    }
  };

  const localizedCategory = translateCategory(spot.category, language);
  const localizedCity = translateCity(spot.city, language);
  const localizedCountry = translateCountry(spot.country, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Hidden File Input for Image Replacement */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleEditImageUpload}
        className="hidden"
      />

      <div className="relative w-full max-w-5xl bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-orange-950/60 my-8 flex flex-col lg:flex-row max-h-[90vh] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#121214]/80 text-zinc-400 hover:text-white border border-zinc-700/80 hover:bg-zinc-800 transition-all shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: High-res Image Preview / Edit Image Upload */}
        <div className="relative lg:w-3/5 bg-[#121214] flex items-center justify-center overflow-hidden min-h-[320px] lg:min-h-[550px] group">
          <img
            src={isEditing ? editImageUrl : spot.image_url}
            alt={spot.brand || spot.category}
            className="w-full h-full object-contain"
          />

          {isEditing && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-orange-950/80 border border-orange-800 flex items-center justify-center text-orange-400">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-zinc-900/90 px-3 py-1.5 rounded-xl border border-zinc-700">
                📱 다른 사진으로 변경 (갤러리 / 카메라)
              </span>
            </button>
          )}

          {/* Location & Open on Map Action Bar */}
          {!isEditing && (
            <div className="absolute bottom-4 left-4 right-4 bg-[#121214]/90 backdrop-blur-md p-3 rounded-2xl border border-zinc-800 flex items-center justify-between gap-2 text-xs text-white">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="font-semibold text-white truncate">
                  {localizedCity}, {localizedCountry}
                </span>
                <span className="text-zinc-500 font-mono text-[11px] hidden sm:inline">
                  ({spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)})
                </span>
              </div>
              <Link
                href={`/map?lat=${spot.latitude}&lng=${spot.longitude}&spotId=${spot.id}`}
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-orange-500/30 transition-all shrink-0 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('openOnMap')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Information / Edit Form */}
        <div className="lg:w-2/5 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          {isEditing ? (
            /* EDIT FORM VIEW */
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-extrabold text-orange-400 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  공간디자인 기록 수정
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-zinc-400 hover:text-white text-xs font-semibold"
                >
                  취소
                </button>
              </div>

              {/* Edit Brand */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">브랜드명</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Edit Category */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">카테고리</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as SpotCategory)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold cursor-pointer"
                >
                  <option value="Window">Window Display</option>
                  <option value="Store Interior">Store Interior</option>
                  <option value="Store Exterior">Store Exterior</option>
                  <option value="Pop-up Store">Pop-up Store</option>
                  <option value="Street">Street Facade</option>
                  <option value="Exhibition">Exhibition Space</option>
                </select>
              </div>

              {/* Edit Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">디자인 설명</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Edit City & Country */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">도시명</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">국가명</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* Edit Style */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">디자인 스타일</label>
                <input
                  type="text"
                  value={editStyle}
                  onChange={(e) => setEditStyle(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Save Edit Button */}
              <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={updateLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{updateLoading ? '저장 중...' : '수정 사항 저장'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* NORMAL DETAIL VIEW */
            <div className="space-y-5">
              {/* Header info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-950/80 text-orange-300 border border-orange-800/80 text-xs font-bold">
                    {localizedCategory}
                  </span>
                  <VerificationBadge isVerified={spot.is_verified} confidence={spot.ai_analysis?.confidence} showConfidence />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {spot.brand || 'Spatial Design Spot'}
                </h2>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                  <div className="flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                    <span>{spot.user_name}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>{formatDate(spot.captured_at, language)}</span>
                  </div>
                </div>
              </div>

              {/* Edit / Delete Quick Toolbar (Strict Authorization: Admin or Author ONLY) */}
              {canModify && (
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#121214] border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-orange-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-orange-400" />
                    <span>정보 수정</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>기록 삭제</span>
                  </button>
                </div>
              )}

              {/* Description */}
              <div className="p-3.5 rounded-2xl bg-[#121214] border border-zinc-800 text-xs leading-relaxed text-zinc-300 font-medium">
                {translateDescription(spot.description, language)}
              </div>

              {/* Multimodal AI Spatial Analysis attributes */}
              {spot.attributes && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    {language === 'ko'
                      ? 'AI 멀티모달 공간 정보 (Spatial Attributes)'
                      : language === 'ja'
                      ? 'AIマルチモーダル空間情報'
                      : language === 'fr'
                      ? 'Informations Spatiales IA'
                      : 'AI Multimodal Spatial Attributes'}
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {/* Style */}
                    {spot.attributes.style && (
                      <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                          <Layers className="w-3.5 h-3.5 text-orange-400" />
                          {language === 'ko' ? '스타일 (Style)' : language === 'ja' ? 'スタイル' : language === 'fr' ? 'Style' : 'Style'}
                        </span>
                        <span className="font-bold text-white">
                          {translateAttribute(spot.attributes.style, language)}
                        </span>
                      </div>
                    )}

                    {/* Lighting */}
                    {spot.attributes.lighting && (
                      <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                          <Sun className="w-3.5 h-3.5 text-orange-400" />
                          {language === 'ko' ? '조명 (Lighting)' : language === 'ja' ? 'ライティング' : language === 'fr' ? 'Éclairage' : 'Lighting'}
                        </span>
                        <span className="font-semibold text-white">
                          {translateAttribute(spot.attributes.lighting, language)}
                        </span>
                      </div>
                    )}

                    {/* Composition */}
                    {spot.attributes.composition && (
                      <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                          <Box className="w-3.5 h-3.5 text-orange-400" />
                          {language === 'ko' ? '구도 (Composition)' : language === 'ja' ? '構図' : language === 'fr' ? 'Composition' : 'Composition'}
                        </span>
                        <span className="font-semibold text-white">
                          {translateAttribute(spot.attributes.composition, language)}
                        </span>
                      </div>
                    )}

                    {/* Colors & Proportion Percentage Bar */}
                    {spot.attributes.colors && spot.attributes.colors.length > 0 && (
                      <div className="p-3 rounded-xl bg-[#121214] border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                            <Palette className="w-3.5 h-3.5 text-orange-400" />
                            {language === 'ko'
                              ? '컬러 팔레트 및 점유 비중 (%)'
                              : language === 'ja'
                              ? 'カラーパレットと占有比率 (%)'
                              : language === 'fr'
                              ? 'Palette de Couleurs (%)'
                              : 'Color Palette & Proportions (%)'}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">Pixel Distribution</span>
                        </div>

                        {/* Horizontal Proportional Color Bar */}
                        <div className="w-full h-3 rounded-full overflow-hidden flex border border-zinc-800 bg-black shadow-inner">
                          {calculateColorPercentages(spot.attributes.colors).map((cp, idx) => (
                            <div
                              key={idx}
                              style={{ width: `${cp.percentage}%`, backgroundColor: cp.hex }}
                              className="h-full transition-all hover:opacity-80 cursor-pointer"
                              title={`${cp.hex} (${cp.percentage}%)`}
                            />
                          ))}
                        </div>

                        {/* Color Hex & Percentage Badges */}
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {calculateColorPercentages(spot.attributes.colors).map((cp, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-[#18181b] px-2 py-1 rounded-lg border border-zinc-800 text-[11px]">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-zinc-700 shrink-0 shadow-xs"
                                style={{ backgroundColor: cp.hex }}
                              />
                              <span className="font-mono text-zinc-200 font-bold">{cp.hex}</span>
                              <span className="font-mono font-extrabold text-orange-400">
                                {cp.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Materials */}
                    {spot.attributes.materials && spot.attributes.materials.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 space-y-1.5">
                        <span className="text-zinc-400 flex items-center gap-1.5 font-bold">
                          <Tag className="w-3.5 h-3.5 text-orange-400" />
                          {language === 'ko' ? '사용 자재 (Materials)' : language === 'ja' ? '使用資材' : language === 'fr' ? 'Matériaux Utilisés' : 'Materials & Elements'}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {spot.attributes.materials.map((mat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[11px] text-white font-bold"
                            >
                              {translateAttribute(mat, language)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          {!isEditing && (
            <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
              <button
                type="button"
                onClick={handleBookmark}
                disabled={saving}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  saved
                    ? 'bg-orange-500 text-white border-orange-400 shadow-md shadow-orange-500/40'
                    : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                <span>{saved ? t('saved') : t('saveSpot')}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl bg-[#121214] hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4 text-orange-400" />
                <span>{copied ? '복사됨!' : '공유'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spot Delete Confirmation Modal */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#18181b] border border-zinc-800 rounded-2xl shadow-2xl shadow-rose-950/50 p-6 space-y-4 text-center text-white">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">공간디자인 기록 삭제</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                정말로 이 공간디자인 수집 기록({spot.brand})을 완전히 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleteLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteSpot}
                disabled={deleteLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {deleteLoading ? '삭제 중...' : '기록 삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
