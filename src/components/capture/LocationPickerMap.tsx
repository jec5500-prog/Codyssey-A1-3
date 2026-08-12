'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { reverseGeocode, geocodeCityOrAddress } from '@/lib/services/geoService';

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

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="도시나 장소를 검색하세요 (예: 서울 강남, Tokyo Ginza, Paris)"
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 cursor-pointer shrink-0"
        >
          {loading ? '검색 중...' : '위치 검색'}
        </button>
      </form>

      {/* Map Picker Container */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-zinc-800 bg-[#121214]">
        <div ref={mapRef} className="w-full h-full z-10" />
        <div className="absolute top-2 left-2 z-20 px-2.5 py-1 rounded-lg bg-[#18181b]/90 text-orange-400 border border-zinc-700 text-[11px] font-bold shadow-md pointer-events-none">
          👆 지도를 터치/클릭하여 위치를 지정하세요
        </div>
      </div>
    </div>
  );
}
