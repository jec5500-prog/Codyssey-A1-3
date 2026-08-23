'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Spot, SpotCategory } from '@/lib/types';
import VerificationBadge from '../common/VerificationBadge';
import { MapPin, Filter, Eye, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  translateCategory,
  translateCity,
  translateCountry,
  translateAttribute,
} from '@/lib/i18n/translationUtils';

interface SpotMapProps {
  spots: Spot[];
  onSelectSpot: (spot: Spot) => void;
  initialLat?: number;
  initialLng?: number;
  initialSpotId?: string | null;
}

export default function SpotMap({
  spots,
  onSelectSpot,
  initialLat,
  initialLng,
  initialSpotId,
}: SpotMapProps) {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<SpotCategory | 'All'>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeSpot, setActiveSpot] = useState<Spot | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Set active spot if initialSpotId passed
  useEffect(() => {
    if (initialSpotId && spots.length > 0) {
      const match = spots.find((s) => s.id === initialSpotId);
      if (match) setActiveSpot(match);
    }
  }, [initialSpotId, spots]);

  const categories: (SpotCategory | 'All')[] = [
    'All',
    'Window',
    'Store Interior',
    'Store Exterior',
    'Pop-up Store',
    'Street',
    'Exhibition',
  ];

  const cities = Array.from(new Set(spots.map((s) => s.city)));

  const filteredSpots = spots.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (selectedCity !== 'All' && s.city !== selectedCity) return false;
    return true;
  });

  if (!isClient) {
    return (
      <div className="w-full h-[680px] bg-zinc-950 rounded-3xl border border-zinc-800 flex items-center justify-center text-zinc-500">
        {t('loadingMap')}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[700px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 flex flex-col">
      {/* Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-950/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 pointer-events-auto overflow-x-auto max-w-full shadow-lg scrollbar-none">
          <Filter className="w-4 h-4 text-orange-400 ml-2 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {translateCategory(cat, language)}
            </button>
          ))}
        </div>

        {/* City Filter & Live GPS Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={async () => {
              try {
                const { getCurrentUserLocation } = await import('@/lib/services/geoService');
                const loc = await getCurrentUserLocation();
                if (loc) {
                  // Trigger custom location event or view change
                  const event = new CustomEvent('flyToUserLocation', { detail: loc });
                  window.dispatchEvent(event);
                }
              } catch (e) {
                alert(language === 'ko' ? 'GPS 위치 권한을 확인해 주세요.' : language === 'ja' ? 'GPS位置の権限を確認してください。' : language === 'fr' ? 'Veuillez vérifier les autorisations GPS.' : language === 'zh' ? '请检查 GPS 位置权限。' : language === 'es' ? 'Por favor verifique los permisos de GPS.' : 'Please check GPS location permissions.');
              }
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-xs py-1.5 px-3 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer transition-all shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 animate-pulse text-white" />
            <span className="hidden sm:inline">{language === 'ko' ? '내 GPS 위치' : language === 'ja' ? '現在地 GPS' : language === 'fr' ? 'Mon GPS' : language === 'zh' ? '我的 GPS' : language === 'es' ? 'Mi GPS' : 'My GPS'}</span>
          </button>

          <div className="bg-zinc-950/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 flex items-center gap-2 shadow-lg">
            <MapPin className="w-4 h-4 text-orange-400 ml-2" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-zinc-900 text-zinc-200 text-xs py-1.5 px-3 rounded-xl border border-zinc-700 focus:outline-none cursor-pointer font-medium"
            >
              <option value="All">{t('allCities')} ({filteredSpots.length})</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {translateCity(city, language)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Engine Container */}
      <LeafletMapEngine
        spots={filteredSpots}
        onMarkerClick={(spot) => setActiveSpot(spot)}
        initialLat={initialLat}
        initialLng={initialLng}
      />

      {/* Active Spot Floating Card Drawer */}
      {activeSpot && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 bg-zinc-900/95 backdrop-blur-md border border-cyan-500/60 rounded-2xl p-4 shadow-2xl animate-slide-up space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 min-w-0">
              <img
                src={activeSpot.image_url}
                alt={activeSpot.brand}
                className="w-20 h-20 rounded-xl object-cover border border-zinc-800 shrink-0 shadow-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider truncate">
                    {translateCategory(activeSpot.category, language)}
                  </span>
                  <VerificationBadge isVerified={activeSpot.is_verified} size="sm" />
                </div>
                <h4 className="font-bold text-sm text-white truncate">{activeSpot.brand}</h4>
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  {translateCity(activeSpot.city, language)}, {translateCountry(activeSpot.country, language)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveSpot(null)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono text-[11px] truncate max-w-[180px]">
              {activeSpot.attributes?.style
                ? translateAttribute(activeSpot.attributes.style, language)
                : 'Spatial Design'}
            </span>
            <button
              onClick={() => onSelectSpot(activeSpot)}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-xs bg-zinc-950 px-3 py-1.5 rounded-lg border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-sm"
            >
              <span>{t('viewDetails')}</span>
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Leaflet Client Engine with strict lifecycle safety & zero container reuse errors
function LeafletMapEngine({
  spots,
  onMarkerClick,
  initialLat,
  initialLng,
}: {
  spots: Spot[];
  onMarkerClick: (spot: Spot) => void;
  initialLat?: number;
  initialLng?: number;
}) {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    try {
      const L = require('leaflet');

      // Fix default marker icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

    // Cleanup existing Leaflet instance if attached
    if (leafletInstance.current) {
      try {
        leafletInstance.current.remove();
      } catch {
        // Ignore unmount error
      }
      leafletInstance.current = null;
    }

    if (mapRef.current && (mapRef.current as any)._leaflet_id) {
      (mapRef.current as any)._leaflet_id = null;
    }

    // Validate coordinates
    const validLat = typeof initialLat === 'number' && !isNaN(initialLat) ? initialLat : undefined;
    const validLng = typeof initialLng === 'number' && !isNaN(initialLng) ? initialLng : undefined;

    const centerLat = validLat || 35.6715;
    const centerLng = validLng || 139.7650;
    const zoomLevel = validLat && validLng ? 14 : 3;

    // Instantiate map with mobile touch support
    const map = L.map(mapRef.current, {
      center: [centerLat, centerLng],
      zoom: zoomLevel,
      zoomControl: false,
      tap: false,
    });

    // Primary & Fallback Full-Color Map Tile Layers
    const primaryTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO Voyager',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    const fallbackTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap Full Color',
      maxZoom: 19,
    });

    primaryTiles.addTo(map);

    primaryTiles.on('tileerror', () => {
      if (!map.hasLayer(fallbackTiles)) {
        fallbackTiles.addTo(map);
      }
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletInstance.current = map;

    // User GPS location event listener
    let userMarker: any = null;
    const handleFlyToUser = (e: any) => {
      const { latitude, longitude, city, country } = e.detail || {};
      if (latitude && longitude && map) {
        map.flyTo([latitude, longitude], 15, { duration: 1.2 });
        if (userMarker) {
          userMarker.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            className: 'user-gps-marker',
            html: `
              <div style="
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: #f97316;
                border: 3px solid #ffffff;
                box-shadow: 0 0 20px rgba(249, 115, 22, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-weight: bold;
                font-size: 14px;
              " class="animate-pulse">📍</div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });
          userMarker = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup(`<b>${language === 'ko' ? '내 실시간 GPS 위치' : language === 'ja' ? '現在地 GPS' : language === 'fr' ? 'Ma position GPS en direct' : language === 'zh' ? '我的实时 GPS 位置' : language === 'es' ? 'Mi ubicación GPS en tiempo real' : 'My Live GPS Location'}</b><br/>${city}, ${country}`, { openPopup: true });
        }
      }
    };

    window.addEventListener('flyToUserLocation', handleFlyToUser);

    // Mobile Leaflet Tile Fix: invalidateSize after mount
    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {}
    }, 250);

    // Add pins for all valid spots
    spots.forEach((spot) => {
      if (typeof spot.latitude !== 'number' || typeof spot.longitude !== 'number') return;
      if (isNaN(spot.latitude) || isNaN(spot.longitude)) return;

      const isVerified = spot.is_verified;
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            position: relative;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          " class="hover:scale-125" title="${spot.brand || spot.category} — ${isVerified ? (language === 'ko' ? 'Verified Spot (검증된 스팟)' : language === 'ja' ? '検証済みスポット' : language === 'fr' ? 'Spot Vérifié' : language === 'zh' ? '已验证空间' : language === 'es' ? 'Espacio Verificado' : 'Verified Spot') : (language === 'ko' ? 'AI Field Spot (현장 스팟)' : language === 'ja' ? 'AI現場スポット' : language === 'fr' ? 'Spot Terrain IA' : language === 'zh' ? 'AI 现场空间' : language === 'es' ? 'Espacio IA' : 'AI Field Spot')}">
            <div style="
              width: 38px;
              height: 38px;
              border-radius: ${isVerified ? '10px' : '50%'};
              background-image: url('${spot.image_url}');
              background-size: cover;
              background-position: center;
              border: 2.5px solid ${isVerified ? '#10B981' : '#f97316'};
              box-shadow: 0 0 14px ${isVerified ? 'rgba(16,185,129,0.75)' : 'rgba(249,115,22,0.75)'};
            "></div>
            <div style="
              position: absolute;
              top: -4px;
              right: -4px;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: ${isVerified ? '#10B981' : '#f97316'};
              color: #ffffff;
              border: 2px solid #121214;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: 800;
              box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            ">
              ${isVerified ? '✓' : '📷'}
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([spot.latitude, spot.longitude], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onMarkerClick(spot);
        map.flyTo([spot.latitude, spot.longitude], 14, { duration: 1.0 });
      });
    });

    // Handle view positioning cleanly
    if (validLat && validLng) {
      map.setView([validLat, validLng], 14);
    } else if (spots.length > 0) {
      const validSpots = spots.filter(
        (s) => typeof s.latitude === 'number' && !isNaN(s.latitude) && typeof s.longitude === 'number' && !isNaN(s.longitude)
      );
      if (validSpots.length > 0) {
        const bounds = L.latLngBounds(validSpots.map((s) => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
      }
    }

    } catch (err) {
      console.warn('Leaflet map init warning:', err);
    }

    return () => {
      if (leafletInstance.current) {
        try {
          leafletInstance.current.remove();
        } catch {
          // Ignore
        }
        leafletInstance.current = null;
      }
    };
  }, [spots, initialLat, initialLng]);

  return <div ref={mapRef} className="w-full h-full z-10 rounded-3xl" />;
}
