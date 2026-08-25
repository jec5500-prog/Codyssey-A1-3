'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Sparkles,
  MapPin,
  CheckCircle2,
  Tag,
  Palette,
  Loader2,
  RefreshCw,
  Plus,
  X,
  Camera,
  Map as MapIcon,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import { SpotCategory, Spot } from '@/lib/types';
import { extractExifFromFile, reverseGeocode, getCoordinatesForCity } from '@/lib/services/geoService';
import { analyzeSpatialImage, SpatialAIAnalysisResult } from '@/lib/services/aiService';
import { createSpot } from '@/lib/services/dbService';
import VerificationBadge from '../common/VerificationBadge';
import { compressImageFile } from '@/lib/utils/imageCompressor';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useAuth } from '@/lib/auth/AuthContext';
import LocationPickerMap from './LocationPickerMap';
import { extractDominantColorsFromImage, calculateColorPercentages } from '@/lib/utils/colorExtractor';
import {
  translateCategory,
  translateCountry,
  translateCity,
  translateAttribute,
  translateDescription,
  translateAnalysisField,
  translateAnalysisList,
} from '@/lib/i18n/translationUtils';

const SAMPLE_CAPTURES = [
  {
    name: 'Tokyo Ginza Pop-up',
    url: 'https://images.unsplash.com/photo-1555529771-7888783a18d3?auto=format&fit=crop&w=800&q=80',
    lat: 35.6715,
    lng: 139.7650,
    city: 'Tokyo',
    country: 'Japan',
  },
  {
    name: 'Paris Champs-Élysées Window',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    lat: 48.8667,
    lng: 2.3083,
    city: 'Paris',
    country: 'France',
  },
  {
    name: 'Seoul Seongsu Facade',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    lat: 37.5445,
    lng: 127.0560,
    city: 'Seoul',
    country: 'South Korea',
  },
];

export default function CaptureForm() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // State workflow
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'verify'>('upload');
  const [locationMode, setLocationMode] = useState<'ai' | 'map'>('ai');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  // Extracted location metadata
  const [latitude, setLatitude] = useState<number>(37.5665);
  const [longitude, setLongitude] = useState<number>(126.9780);
  const [country, setCountry] = useState<string>('South Korea');
  const [city, setCity] = useState<string>('Seoul');
  const [capturedAt, setCapturedAt] = useState<string>(new Date().toISOString().slice(0, 10));

  // AI & User Editable attributes (Initialized strictly empty; filled dynamically by AI API)
  const [category, setCategory] = useState<SpotCategory>('Window');
  const [brand, setBrand] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [style, setStyle] = useState<string>('');
  const [colors, setColors] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newMaterialInput, setNewMaterialInput] = useState<string>('');
  const [lighting, setLighting] = useState<string>('');
  const [composition, setComposition] = useState<string>('');
  const [objects, setObjects] = useState<string[]>([]);
  const [newObjectInput, setNewObjectInput] = useState<string>('');
  const [theme, setTheme] = useState<string>('');
  const [aiConfidence, setAiConfidence] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [rawAnalysis, setRawAnalysis] = useState<SpatialAIAnalysisResult | null>(null);
  const [lastCaptureArgs, setLastCaptureArgs] = useState<{
    imgSrc: string;
    file?: File;
    sampleOverride?: typeof SAMPLE_CAPTURES[0];
  } | null>(null);

  // Helper to purge all analysis states before a new analysis run
  const resetAnalysisStates = () => {
    setAnalysisError(null);
    setRawAnalysis(null);
    setBrand('');
    setDescription('');
    setStyle('');
    setColors([]);
    setMaterials([]);
    setLighting('');
    setComposition('');
    setObjects([]);
    setTheme('');
    setAiConfidence(0);
  };

  // Client-side Sample Image URL to Base64 converter
  const sampleUrlToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('CORS_FETCH_FAILED');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // File Handler for Android & iOS
  const handleFileSelect = async (file: File) => {
    if (!file) return;
    resetAnalysisStates();

    // Pre-validation: Max 3MB raw file size limit
    if (file.size > 3 * 1024 * 1024) {
      setAnalysisError('이미지 크기를 3MB 이하로 줄인 뒤 다시 시도해 주세요.');
      setStage('upload');
      return;
    }

    setFileName(file.name || 'Android_Captured_Photo.jpg');
    setStage('analyzing');

    // 1. Instant local preview
    let fastPreview = '';
    try {
      fastPreview = URL.createObjectURL(file);
      setImagePreview(fastPreview);
    } catch (e) {}

    // 2. Fast compressed data URL for storage
    let compressedSrc = fastPreview;
    try {
      compressedSrc = await compressImageFile(file);
      if (compressedSrc) {
        setImagePreview(compressedSrc);
      }
    } catch (err) {
      console.warn('Compression fallback used:', err);
    }

    // 3. Run AI spatial analysis pipeline
    processCapture(compressedSrc || fastPreview, file);
  };

  // Sample Selection Handler
  const handleSampleSelect = async (sample: typeof SAMPLE_CAPTURES[0]) => {
    resetAnalysisStates();
    setFileName(sample.name);
    setImagePreview(sample.url);
    setLatitude(sample.lat);
    setLongitude(sample.lng);
    setCity(sample.city);
    setCountry(sample.country);

    try {
      const b64Data = await sampleUrlToBase64(sample.url);
      processCapture(b64Data, undefined, sample);
    } catch (e) {
      setAnalysisError('샘플 이미지를 분석할 수 없습니다. 직접 이미지를 업로드해 주세요.');
      setStage('upload');
    }
  };

  // Processing pipeline
  const processCapture = async (
    imgSrc: string,
    file?: File,
    sampleOverride?: typeof SAMPLE_CAPTURES[0]
  ) => {
    setAnalysisError(null);
    setLastCaptureArgs({ imgSrc, file, sampleOverride });

    // Pre-send validation: Max Base64 + JSON payload limit (4MB chars)
    if (imgSrc && imgSrc.length > 4 * 1024 * 1024) {
      setAnalysisError('이미지 크기를 3MB 이하로 줄인 뒤 다시 시도해 주세요.');
      setStage('upload');
      return;
    }

    setStage('analyzing');

    // 1. Location Processing based on selected mode
    if (file && locationMode === 'ai') {
      const exif = await extractExifFromFile(file);
      if (exif.latitude && exif.longitude) {
        setLatitude(exif.latitude);
        setLongitude(exif.longitude);
        const geo = await reverseGeocode(exif.latitude, exif.longitude);
        setCity(geo.city);
        setCountry(geo.country);
      }
      if (exif.capturedAt) {
        setCapturedAt(exif.capturedAt.slice(0, 10));
      }
    } else if (sampleOverride) {
      setLatitude(sampleOverride.lat);
      setLongitude(sampleOverride.lng);
      setCity(sampleOverride.city);
      setCountry(sampleOverride.country);
    }

    // 2. Real-Time HTML5 Canvas Pixel Color Extraction
    try {
      const realPixelColors = await extractDominantColorsFromImage(imgSrc, 4);
      if (realPixelColors && realPixelColors.length > 0) {
        setColors(realPixelColors);
      }
    } catch (e) {}

    // 3. Multimodal AI Analysis via Vercel Python API (/api/analyze)
    try {
      const aiResult = await analyzeSpatialImage(imgSrc, file?.name || sampleOverride?.name, 'en');

      setRawAnalysis(aiResult);
      setCategory(aiResult.category || 'Store Interior');
      setBrand(aiResult.brand || '');
      setDescription(aiResult.description || '');
      setStyle(aiResult.style || '');
      if (Array.isArray(aiResult.colors) && aiResult.colors.length > 0) {
        setColors(aiResult.colors);
      }
      setMaterials(Array.isArray(aiResult.materials) ? aiResult.materials : []);
      setLighting(aiResult.lighting || '');
      setComposition(aiResult.composition || '');
      setObjects(Array.isArray(aiResult.objects) ? aiResult.objects : []);
      setTheme(aiResult.theme || '');
      setAiConfidence(typeof aiResult.confidence === 'number' ? aiResult.confidence : 0.9);
      setStage('verify');
    } catch (err: any) {
      setAnalysisError(err?.message || 'AI 공간 분석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setStage('upload');
    }
  };

  // Material Tag actions
  const addMaterial = () => {
    const trimmed = newMaterialInput.trim();
    if (trimmed && !materials.includes(trimmed)) {
      const next = [...materials, trimmed];
      setMaterials(next);
      if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, materials: next });
      setNewMaterialInput('');
    }
  };

  const removeMaterial = (index: number) => {
    const next = materials.filter((_, i) => i !== index);
    setMaterials(next);
    if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, materials: next });
  };

  // Object & Prop Tag actions
  const addObject = () => {
    const trimmed = newObjectInput.trim();
    if (trimmed && !objects.includes(trimmed)) {
      const next = [...objects, trimmed];
      setObjects(next);
      if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, objects: next });
      setNewObjectInput('');
    }
  };

  const removeObject = (index: number) => {
    const next = objects.filter((_, i) => i !== index);
    setObjects(next);
    if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, objects: next });
  };

  // City & Country Change Handler with Coordinate Sync
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const coords = getCoordinatesForCity(newCity, country);
    setLatitude(coords.lat);
    setLongitude(coords.lng);
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const coords = getCoordinatesForCity(city, newCountry);
    setLatitude(coords.lat);
    setLongitude(coords.lng);
  };

  // Save handler
  const handleSaveSpot = async () => {
    if (!imagePreview) return;
    setSaving(true);

    // Sync coordinate fallback if city was customized
    const finalCoords = (latitude === 37.5665 && longitude === 126.9780)
      ? getCoordinatesForCity(city, country)
      : { lat: latitude, lng: longitude };

    if (!user) {
      setSaving(false);
      openAuthModal('login');
      return;
    }

    const newSpotData: Omit<Spot, 'id' | 'created_at'> = {
      user_id: user.id,
      user_name: user.name,
      user_avatar: user.avatar,
      image_url: imagePreview,
      country,
      city,
      latitude: finalCoords.lat,
      longitude: finalCoords.lng,
      category,
      brand: brand || 'Unbranded Spatial Spot',
      description: description || 'Spatial field photo entry.',
      captured_at: new Date(capturedAt).toISOString(),
      is_verified: isVerified,
      attributes: {
        spot_id: '',
        colors,
        materials,
        style,
        lighting,
        composition,
        objects,
        theme,
      },
      ai_analysis: {
        spot_id: '',
        confidence: aiConfidence,
        is_verified: isVerified,
        created_at: new Date().toISOString(),
        analysis: {
          category,
          brand,
          description,
          style,
          colors,
          materials,
          lighting,
          composition,
          objects,
          theme,
        },
      },
    };

    await createSpot(newSpotData);
    setSaving(false);
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hidden File Inputs for Direct Android Click Triggers */}
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18181b] border border-orange-800 text-orange-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Multimodal AI Spatial Analysis & Field Capture
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t('captureTitle')}
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          {t('captureDesc')}
        </p>
      </div>

      {/* STAGE 1: UPLOAD & LOCATION MODE CHOICE */}
      {stage === 'upload' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-md shadow-2xl">
          {/* Analysis Error & Retry Box */}
          {analysisError && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center justify-between gap-4 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2.5 font-medium">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-pulse" />
                <span>{analysisError}</span>
              </div>
              {lastCaptureArgs && (
                <button
                  type="button"
                  onClick={() => {
                    setAnalysisError(null);
                    processCapture(lastCaptureArgs.imgSrc, lastCaptureArgs.file, lastCaptureArgs.sampleOverride);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{language === 'ko' ? '다시 시도 (Retry)' : language === 'ja' ? '再試行 (Retry)' : language === 'fr' ? 'Réessayer (Retry)' : language === 'zh' ? '重试 (Retry)' : language === 'es' ? 'Reintentar (Retry)' : 'Retry'}</span>
                </button>
              )}
            </div>
          )}

          {/* REGISTRATION MODE SELECTOR */}
          <div className="space-y-3 p-4 rounded-2xl bg-[#121214] border border-zinc-800">
            <label className="block text-xs font-extrabold text-orange-400 uppercase tracking-wider">
              ⚙️ {language === 'ko' ? '위치 및 공간 정보 등록 방식 선택' : language === 'ja' ? '位置および空間情報登録方式の選択' : language === 'fr' ? 'Mode d\'enregistrement de la localisation' : language === 'zh' ? '选择位置与空间信息注册模式' : language === 'es' ? 'Seleccionar Modo de Registro de Ubicación' : 'Select Registration Mode'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocationMode('ai')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  locationMode === 'ai'
                    ? 'bg-orange-950/60 border-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-[#18181b] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('modeAiExif')}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {language === 'ko' ? '사진의 EXIF GPS 데이터와 시각 디자인 요소를 AI가 자동으로 추출합니다.' : language === 'ja' ? '写真のEXIF GPSデータとデザイン要素をAIが自動抽出します。' : language === 'fr' ? 'L\'IA extrait automatiquement les données EXIF GPS et les éléments visuels.' : language === 'zh' ? 'AI 自动提取照片 EXIF GPS 数据与视觉设计要素。' : language === 'es' ? 'La IA extrae automáticamente datos GPS EXIF y atributos visuales.' : 'AI automatically extracts EXIF GPS and visual design attributes.'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocationMode('map')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  locationMode === 'map'
                    ? 'bg-orange-950/60 border-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-[#18181b] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <MapIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t('modeDirectMap')}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {language === 'ko' ? '지도를 직접 클릭하거나 드래그하여 정확한 위치 핀을 지정합니다.' : language === 'ja' ? 'マップをクリックして正確なピン位置を指定します。' : language === 'fr' ? 'Cliquez sur la carte pour placer précisément le repère.' : language === 'zh' ? '在地图上点击或拖拽以指定精确位置标记。' : language === 'es' ? 'Haga clic o arrastre en el mapa para establecer el pin de ubicación exacto.' : 'Click or drag on the map to set exact GPS pin coordinates.'}
                  </p>
                </div>
              </button>
            </div>

            {/* Interactive Map Location Picker Component */}
            {locationMode === 'map' && (
              <div className="pt-2">
                <LocationPickerMap
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng, c, co) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setCity(c);
                    setCountry(co);
                  }}
                />
                <div className="mt-2 p-2.5 rounded-xl bg-orange-950/40 border border-orange-800/60 text-xs text-orange-300 flex items-center justify-between font-mono">
                  <span>{language === 'ko' ? '선택된 좌표 및 장소:' : language === 'ja' ? '選択された座標と場所:' : language === 'fr' ? 'Coordonnées et lieu sélectionnés :' : language === 'zh' ? '已选择的坐标与地点：' : language === 'es' ? 'Coordenadas y lugar seleccionados:' : 'Selected Coordinates & Location:'}</span>
                  <span className="font-bold text-white">
                    {translateCity(city, language)}, {translateCountry(country, language)} ({latitude.toFixed(4)}, {longitude.toFixed(4)})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* File Dropzone & Mobile Camera Button */}
          <div className="space-y-4">
            <div
              onClick={() => galleryInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all group cursor-pointer ${
                isDragging
                  ? 'border-orange-400 bg-orange-950/60 scale-[1.02] shadow-2xl shadow-orange-500/40'
                  : 'border-zinc-700 hover:border-orange-500 bg-[#121214]/80 hover:bg-[#121214]'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-950/80 border border-orange-800 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className={`w-7 h-7 ${isDragging ? 'animate-bounce text-orange-300' : ''}`} />
                </div>
                <div>
                  <p className="text-base font-bold text-white">
                    {isDragging ? (language === 'ko' ? '✨ 여기에 사진을 놓으면 즉시 AI 분석이 시작됩니다!' : language === 'ja' ? '✨ ここに写真をドロップするとAI解析が始まります！' : language === 'fr' ? '✨ Déposez la photo ici pour lancer l\'analyse IA !' : language === 'zh' ? '✨ 拖放照片至此立即开始 AI 分析！' : language === 'es' ? '✨ ¡Suelte la foto aquí para iniciar el análisis IA!' : '✨ Drop photo here to start instant AI analysis!') : t('dropzoneText')}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {language === 'ko' ? '📱 드래그 앤 드롭으로 사진을 넣거나, 클릭하여 갤러리/카메라 사진 선택' : language === 'ja' ? '📱 ドラッグ＆ドロップまたはクリックで写真を選択' : language === 'fr' ? '📱 Glissez-déposez ou cliquez pour choisir une photo' : language === 'zh' ? '📱 拖放照片或点击选择相册/相机照片' : language === 'es' ? '📱 Arrastre y suelte o haga clic para seleccionar una foto' : '📱 Drag & drop or click to choose gallery / camera photo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dual Action Mobile Choice Buttons (Android & iOS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Button 1: Android Gallery Picker */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="py-3.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <UploadCloud className="w-4 h-4 text-orange-400" />
                <span>🖼️ {language === 'ko' ? '갤러리/앨범 사진 선택' : language === 'ja' ? 'ギャラリー/アルバム写真を選択' : language === 'fr' ? 'Choisir dans la galerie' : language === 'zh' ? '从相册选择照片' : language === 'es' ? 'Seleccionar foto de galería' : 'Choose Gallery Photo'}</span>
              </button>

              {/* Button 2: Direct Native Camera Trigger */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>📷 {language === 'ko' ? '핸드폰 카메라로 직접 촬영' : language === 'ja' ? 'カメラで撮影' : language === 'fr' ? 'Prendre une photo avec l\'appareil' : language === 'zh' ? '用相机直接拍摄' : language === 'es' ? 'Tomar foto con la cámara' : 'Take Photo with Camera'}</span>
              </button>
            </div>
          </div>

          {/* Preset Sample Selection */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <p className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
              {t('demoSamples')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SAMPLE_CAPTURES.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSampleSelect(sample)}
                  className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-orange-500 cursor-pointer bg-[#121214] transition-all"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="p-2.5 bg-[#18181b] text-xs">
                    <p className="font-semibold text-zinc-200 group-hover:text-orange-300">{sample.name}</p>
                    <p className="text-[11px] text-zinc-500">{translateCity(sample.city, language)}, {translateCountry(sample.country, language)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: AI ANALYZING */}
      {stage === 'analyzing' && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-orange-950/80 border border-orange-800/80 flex items-center justify-center mx-auto text-orange-400 animate-bounce">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {language === 'ko' ? 'AI 멀티모달 공간 분석 진행 중' : language === 'ja' ? 'AIマルチモーダル空間解析進行中' : language === 'fr' ? 'Analyse Spatiale IA en Cours' : language === 'zh' ? 'AI 多模态空间分析进行中' : language === 'es' ? 'Análisis Espacial IA en Proceso' : 'AI Multimodal Spatial Analysis in Progress'}
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {language === 'ko' ? '이미지에서 카테고리, 자재, 조명, 구도, 컬러 팔레트 및 공간 컨셉을 추출하는 중입니다...' : language === 'ja' ? '画像からカテゴリ、資材、ライティング、構図、カラーパレット、空間コンセプトを抽出中...' : language === 'fr' ? 'Extraction de la catégorie, des matériaux, de l\'éclairage, du style et de la palette...' : language === 'zh' ? '正在从图片中提取类别、材质、照明、构图、色彩搭配与空间概念...' : language === 'es' ? 'Extrayendo categoría, materiales, iluminación, composición y paleta de colores...' : 'Extracting category, materials, lighting, style, color palette, and spatial concept...'}
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: VERIFY & EDIT */}
      {stage === 'verify' && imagePreview && (
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Image Preview & Map Coordinates */}
          <div className="p-6 bg-[#121214] flex flex-col justify-between space-y-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-zinc-800">
              <img
                src={imagePreview}
                alt="Captured Spot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <VerificationBadge isVerified={isVerified} confidence={aiConfidence} showConfidence />
              </div>
            </div>

            {/* Editable GPS & Location Inputs */}
            <div className="p-4 rounded-xl bg-[#18181b] border border-zinc-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-orange-400 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {language === 'ko' ? '등록 위치 및 좌표 정보' : language === 'ja' ? '登録位置および座標情報' : language === 'fr' ? 'Localisation et coordonnées' : language === 'zh' ? '注册位置与坐标信息' : language === 'es' ? 'Ubicación y coordenadas' : 'Location & Coordinates'}
                </span>
                <span className="font-semibold text-white text-xs">
                  {translateCity(city, language)}, {translateCountry(country, language)}
                </span>
                <span className="font-mono text-zinc-400 text-[11px]">
                  ({latitude.toFixed(4)}, {longitude.toFixed(4)})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">{language === 'ko' ? '도시 (City) *' : language === 'ja' ? '都市 (City) *' : language === 'fr' ? 'Ville (City) *' : language === 'zh' ? '城市 (City) *' : language === 'es' ? 'Ciudad (City) *' : 'City *'}</label>
                  <input
                    type="text"
                    value={translateCity(city, language)}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-1.5 px-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">{language === 'ko' ? '국가 (Country) *' : language === 'ja' ? '国 (Country) *' : language === 'fr' ? 'Pays (Country) *' : language === 'zh' ? '国家 (Country) *' : language === 'es' ? 'País (Country) *' : 'Country *'}</label>
                  <input
                    type="text"
                    value={translateCountry(country, language)}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-1.5 px-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editable Metadata Form */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  {language === 'ko' ? 'AI 분석 공간 정보' : language === 'ja' ? 'AI解析空間情報' : language === 'fr' ? 'Informations Spatiales IA' : language === 'zh' ? 'AI 分析空间信息' : language === 'es' ? 'Atributos Espaciales IA' : 'AI Spatial Attributes'}
                </h3>
                <button
                  type="button"
                  onClick={() => setStage('upload')}
                  className="text-zinc-400 hover:text-white flex items-center gap-1 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                  <span>{language === 'ko' ? '다시 선택' : language === 'ja' ? '再選択' : language === 'fr' ? 'Rechoisir' : language === 'zh' ? '重新选择' : language === 'es' ? 'Reelegir' : 'Reselect'}</span>
                </button>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  {t('brandName')} *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={language === 'ko' ? '예: Gentle Monster, Louis Vuitton' : language === 'ja' ? '例: Gentle Monster, Louis Vuitton' : language === 'fr' ? 'ex: Gentle Monster, Louis Vuitton' : language === 'zh' ? '例：Gentle Monster, Louis Vuitton' : language === 'es' ? 'ej: Gentle Monster, Louis Vuitton' : 'e.g. Gentle Monster, Louis Vuitton'}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  {t('spatialCategory')}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpotCategory)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold cursor-pointer"
                >
                  <option value="Window">{translateCategory('Window', language)}</option>
                  <option value="Store Interior">{translateCategory('Store Interior', language)}</option>
                  <option value="Store Exterior">{translateCategory('Store Exterior', language)}</option>
                  <option value="Pop-up Store">{translateCategory('Pop-up Store', language)}</option>
                  <option value="Street">{translateCategory('Street', language)}</option>
                  <option value="Exhibition">{translateCategory('Exhibition', language)}</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  {t('spatialDesc')}
                </label>
                <textarea
                  rows={2}
                  value={translateAnalysisField(rawAnalysis, 'description', description, language)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDescription(v);
                    if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, description: v });
                  }}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  {language === 'ko' ? '디자인 스타일 (Style)' : language === 'ja' ? 'デザインスタイル' : language === 'fr' ? 'Style de Design' : language === 'zh' ? '设计风格' : language === 'es' ? 'Estilo de Diseño' : 'Design Style'}
                </label>
                <input
                  type="text"
                  value={translateAnalysisField(rawAnalysis, 'style', style, language)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStyle(v);
                    if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, style: v });
                  }}
                  placeholder={language === 'ko' ? '예: Minimalist Brutalism' : language === 'ja' ? '例: Minimalist Brutalism' : language === 'fr' ? 'ex: Minimalist Brutalism' : language === 'zh' ? '例：Minimalist Brutalism' : language === 'es' ? 'ej: Minimalist Brutalism' : 'e.g. Minimalist Brutalism'}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Color Palette & Proportional Percentages */}
              <div className="space-y-2 p-3 rounded-2xl bg-[#121214] border border-zinc-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 uppercase flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5 text-orange-400" />
                    {language === 'ko' ? '컬러 팔레트 및 점유 비중 (%)' : language === 'ja' ? 'カラーパレットと占有比率 (%)' : language === 'fr' ? 'Palette de Couleurs (%)' : language === 'zh' ? '色彩搭配与占比 (%)' : language === 'es' ? 'Paleta de Colores y Proporciones (%)' : 'Color Palette & Proportions (%)'}
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">Live Canvas Analysis</span>
                </div>

                {/* Horizontal Color Proportions Bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex border border-zinc-800 bg-black">
                  {calculateColorPercentages(colors).map((cp, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${cp.percentage}%`, backgroundColor: cp.hex }}
                      className="h-full transition-all hover:opacity-80 cursor-pointer"
                      title={`${cp.hex} (${cp.percentage}%)`}
                    />
                  ))}
                </div>

                {/* Hex Inputs with Percentage Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {calculateColorPercentages(colors).map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-[#18181b] p-1.5 rounded-xl border border-zinc-800">
                      <span className="w-4 h-4 rounded-full border border-zinc-700 shrink-0 shadow-xs" style={{ backgroundColor: cp.hex }} />
                      <div className="flex flex-col min-w-0">
                        <input
                          type="text"
                          value={colors[idx] || cp.hex}
                          onChange={(e) => {
                            const updated = [...colors];
                            updated[idx] = e.target.value;
                            setColors(updated);
                          }}
                          className="w-16 bg-transparent text-[11px] font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="font-mono text-[10px] font-extrabold text-orange-400">
                          {cp.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  {language === 'ko' ? '주요 자재/소재 (Materials)' : language === 'ja' ? '使用資材' : language === 'fr' ? 'Matériaux Utilisés' : language === 'zh' ? '主要材质' : language === 'es' ? 'Materiales Utilizados' : 'Materials & Elements'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {translateAnalysisList(rawAnalysis, 'materials', materials, language).map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-[#121214] border border-zinc-700 text-xs font-bold flex items-center gap-1 text-white"
                    >
                      {mat}
                      <button onClick={() => removeMaterial(idx)} className="text-zinc-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMaterialInput}
                    onChange={(e) => setNewMaterialInput(e.target.value)}
                    placeholder={language === 'ko' ? '자재 추가 (예: Marble, Neon)' : language === 'ja' ? '資材追加 (例: Marble, Neon)' : language === 'fr' ? 'Ajouter un matériau (ex: Marble)' : language === 'zh' ? '添加材质（例如：Marble, Neon）' : language === 'es' ? 'Agregar material (ej: Marble)' : 'Add material (e.g. Marble, Neon)'}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addMaterial}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lighting & Composition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                    {language === 'ko' ? '조명 설계 (Lighting)' : language === 'ja' ? 'ライティング設計' : language === 'fr' ? 'Conception d\'éclairage' : language === 'zh' ? '照明设计' : language === 'es' ? 'Diseño de Iluminación' : 'Lighting Design'}
                  </label>
                  <input
                    type="text"
                    value={translateAnalysisField(rawAnalysis, 'lighting', lighting, language)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setLighting(v);
                      if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, lighting: v });
                    }}
                    placeholder={language === 'ko' ? '예: Warm Cove Ambient' : language === 'ja' ? '例: Warm Cove Ambient' : language === 'fr' ? 'ex: Warm Cove Ambient' : language === 'zh' ? '例：Warm Cove Ambient' : language === 'es' ? 'ej: Warm Cove Ambient' : 'e.g. Warm Cove Ambient'}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                    {language === 'ko' ? '공간 구도 (Composition)' : language === 'ja' ? '空間構図' : language === 'fr' ? 'Composition spatiale' : language === 'zh' ? '空间构图' : language === 'es' ? 'Composición espacial' : 'Spatial Composition'}
                  </label>
                  <input
                    type="text"
                    value={translateAnalysisField(rawAnalysis, 'composition', composition, language)}
                    onChange={(e) => {
                      const v = e.target.value;
                      setComposition(v);
                      if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, composition: v });
                    }}
                    placeholder={language === 'ko' ? '예: Asymmetrical Monolithic Grid' : language === 'ja' ? '例: Asymmetrical Monolithic Grid' : language === 'fr' ? 'ex: Asymmetrical Monolithic Grid' : language === 'zh' ? '例：Asymmetrical Monolithic Grid' : language === 'es' ? 'ej: Asymmetrical Monolithic Grid' : 'e.g. Asymmetrical Monolithic Grid'}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
              </div>

              {/* Objects & Props Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  {language === 'ko' ? '오브제 및 집기 (Objects & Props)' : language === 'ja' ? 'ディスプレイ什器・オブジェクト' : language === 'fr' ? 'Objets et Accessoires' : language === 'zh' ? '陈列道具与物件' : language === 'es' ? 'Objetos y Accesorios' : 'Objects & Display Props'}
                </label>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {translateAnalysisList(rawAnalysis, 'objects', objects, language).map((obj, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-[#121214] border border-zinc-700 text-xs font-bold flex items-center gap-1 text-white"
                    >
                      {obj}
                      <button onClick={() => removeObject(idx)} className="text-zinc-400 hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newObjectInput}
                    onChange={(e) => setNewObjectInput(e.target.value)}
                    placeholder={language === 'ko' ? '오브제/집기 추가 (예: Glass Pedestal)' : language === 'ja' ? 'オブジェクト追加 (例: Glass Pedestal)' : language === 'fr' ? 'Ajouter un objet (ex: Glass Pedestal)' : language === 'zh' ? '添加陈列道具（例如：Glass Pedestal）' : language === 'es' ? 'Agregar objeto (ej: Glass Pedestal)' : 'Add object/prop (e.g. Glass Pedestal)'}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObject())}
                    className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={addObject}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Theme Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  {language === 'ko' ? '공간 테마 (Spatial Theme)' : language === 'ja' ? '空間テーマ' : language === 'fr' ? 'Thème Spatial' : language === 'zh' ? '空间主题' : language === 'es' ? 'Tema Espacial' : 'Spatial Theme'}
                </label>
                <input
                  type="text"
                  value={translateAnalysisField(rawAnalysis, 'theme', theme, language)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTheme(v);
                    if (rawAnalysis) setRawAnalysis({ ...rawAnalysis, theme: v });
                  }}
                  placeholder={language === 'ko' ? '예: Organic Heritage Craftsmanship' : language === 'ja' ? '例: Organic Heritage Craftsmanship' : language === 'fr' ? 'ex: Organic Heritage Craftsmanship' : language === 'zh' ? '例：Organic Heritage Craftsmanship' : language === 'es' ? 'ej: Organic Heritage Craftsmanship' : 'e.g. Organic Heritage Craftsmanship'}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* Submit / Save Button */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleSaveSpot}
                  disabled={saving}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === 'ko' ? '저장 중...' : language === 'ja' ? '保存中...' : language === 'fr' ? 'Enregistrement...' : language === 'zh' ? '保存中...' : language === 'es' ? 'Guardando...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('savePublish')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
