'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { reverseGeocode, geocodeCityOrAddress } from '@/lib/services/geoService';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number, city: string, country: string) => void;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerMapProps) {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    let map: any;

    try {
      const L = require('leaflet');

      // Delete default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (leafletInstance.current) {
        try {
          leafletInstance.current.remove();
        } catch {}
        leafletInstance.current = null;
      }

      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        (mapRef.current as any)._leaflet_id = null;
      }

      map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 13,
        zoomControl: true,
        tap: false,
      });

      // Full-Color Voyager & OSM Fallback Map Tiles
      const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO Voyager',
        subdomains: 'abcd',
        maxZoom: 19,
      });
      const fallback = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap Full Color',
      });

      tiles.addTo(map);
      tiles.on('tileerror', () => {
        if (!map.hasLayer(fallback)) fallback.addTo(map);
      });

      // Pin marker
      const customIcon = L.divIcon({
        className: 'location-picker-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #F97316;
            border: 3px solid #FFFFFF;
            box-shadow: 0 0 16px rgba(249, 115, 22, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: bold;
          ">📍</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon, draggable: true }).addTo(map);
      markerRef.current = marker;
      leafletInstance.current = map;

      // Handle map click
      map.on('click', async (e: any) => {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        marker.setLatLng([newLat, newLng]);
        const geo = await reverseGeocode(newLat, newLng);
        onLocationSelect(newLat, newLng, geo.city, geo.country);
      });

      // Handle marker drag
      marker.on('dragend', async (e: any) => {
        const pos = e.target.getLatLng();
        const geo = await reverseGeocode(pos.lat, pos.lng);
        onLocationSelect(pos.lat, pos.lng, geo.city, geo.country);
      });

      setTimeout(() => {
        try {
          map.invalidateSize();
        } catch {}
      }, 200);
    } catch (err) {
      console.warn('LocationPickerMap init error:', err);
    }

    return () => {
      if (leafletInstance.current) {
        try {
          leafletInstance.current.remove();
        } catch {}
        leafletInstance.current = null;
      }
    };
  }, []);

  // Update marker position if props change
  useEffect(() => {
    if (leafletInstance.current && markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
      leafletInstance.current.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude]);

  // Search Address/City
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    const result = await geocodeCityOrAddress(searchQuery);
    setLoading(false);
    if (result) {
      onLocationSelect(result.latitude, result.longitude, result.city, result.country);
    }
  };

  // Detect current GPS position
  const handleDetectGPS = async () => {
    setLoading(true);
    try {
      const { getCurrentUserLocation } = await import('@/lib/services/geoService');
      const loc = await getCurrentUserLocation();
      onLocationSelect(loc.latitude, loc.longitude, loc.city, loc.country);
    } catch (err: any) {
      alert('위치 권한이 거부되었거나 GPS 위치를 가져올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar & Live GPS Button */}
      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ko' ? '도시나 장소를 검색하세요 (예: 서울 강남, Tokyo Ginza, Paris)' : language === 'ja' ? '都市や場所を検索 (例: Tokyo Ginza, Paris)' : language === 'fr' ? 'Rechercher une ville ou un lieu (ex: Paris, Tokyo)' : language === 'zh' ? '搜索城市或地点（例如：北京, Tokyo, Paris）' : language === 'es' ? 'Buscar ciudad o lugar (ej: Madrid, Paris)' : 'Search city or address (e.g. Tokyo Ginza, Paris)'}
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
          />
        </form>
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs border border-zinc-700 cursor-pointer shrink-0"
        >
          {loading ? (language === 'ko' ? '검색 중...' : language === 'ja' ? '検索中...' : language === 'fr' ? 'Recherche...' : language === 'zh' ? '搜索中...' : language === 'es' ? 'Buscando...' : 'Searching...') : (language === 'ko' ? '검색' : language === 'ja' ? '検索' : language === 'fr' ? 'Chercher' : language === 'zh' ? '搜索' : language === 'es' ? 'Buscar' : 'Search')}
        </button>
        <button
          type="button"
          onClick={handleDetectGPS}
          disabled={loading}
          className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 cursor-pointer shrink-0 flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{language === 'ko' ? '내 GPS' : language === 'ja' ? '現在地 GPS' : language === 'fr' ? 'Mon GPS' : language === 'zh' ? '我的 GPS' : language === 'es' ? 'Mi GPS' : 'My GPS'}</span>
        </button>
      </div>

      {/* Map Picker Container */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-zinc-800 bg-[#121214]">
        <div ref={mapRef} className="w-full h-full z-10" />
        <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-lg bg-[#18181b]/90 text-orange-400 border border-zinc-700 text-[11px] font-bold shadow-md pointer-events-none">
          👆 {language === 'ko' ? '지도를 터치/클릭하거나 [내 GPS] 버튼을 누르세요' : language === 'ja' ? 'マップをタップ/クリックするか [現在地 GPS] を選択' : language === 'fr' ? 'Touchez la carte ou cliquez sur [Mon GPS]' : language === 'zh' ? '点击/触摸地图或选择 [我的 GPS]' : language === 'es' ? 'Toque el mapa o haga clic en [Mi GPS]' : 'Tap/click map or press [My GPS]'}
        </div>
      </div>
    </div>
  );
}
