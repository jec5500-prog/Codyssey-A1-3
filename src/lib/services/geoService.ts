import ExifReader from 'exifreader';

export interface ExifData {
  latitude?: number;
  longitude?: number;
  capturedAt?: string;
}

export interface LocationResult {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

/**
 * Real-Time User Geolocation Tracking Engine
 * Obtains live GPS coordinates of the connected user via HTML5 Geolocation API
 */
export async function getCurrentUserLocation(): Promise<LocationResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const result = await reverseGeocode(lat, lng);
          resolve(result);
        } catch (e) {
          resolve({
            city: 'My Location',
            country: 'Live GPS',
            latitude: lat,
            longitude: lng,
          });
        }
      },
      (error) => {
        console.warn('Geolocation position error:', error.message);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Continuously watches user live GPS position stream
 */
export function watchUserLocation(
  onSuccess: (loc: LocationResult) => void,
  onError?: (err: GeolocationPositionError) => void
): number | null {
  if (typeof window === 'undefined' || !navigator.geolocation) return null;

  return navigator.geolocation.watchPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      try {
        const result = await reverseGeocode(lat, lng);
        onSuccess(result);
      } catch (e) {
        onSuccess({
          city: 'My Location',
          country: 'Live GPS',
          latitude: lat,
          longitude: lng,
        });
      }
    },
    (err) => {
      console.warn('Watch location error:', err.message);
      onError?.(err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
    }
  );
}

/**
 * Extracts EXIF location & date metadata from image File
 * Fail-safe for older Android WebViews, Samsung Internet & iOS Safari
 */
export async function extractExifFromFile(file: File): Promise<ExifData> {
  try {
    let arrayBuffer: ArrayBuffer;
    if (file && typeof file.arrayBuffer === 'function') {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as ArrayBuffer) || new ArrayBuffer(0));
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsArrayBuffer(file);
      });
    }

    const tags = ExifReader.load(arrayBuffer);

    let latitude: number | undefined = undefined;
    let longitude: number | undefined = undefined;
    let capturedAt: string | undefined = undefined;

    if (tags.GPSLatitude && tags.GPSLongitude) {
      const latVal = tags.GPSLatitude.description;
      const lngVal = tags.GPSLongitude.description;
      if (latVal && lngVal) {
        latitude = parseFloat(latVal);
        longitude = parseFloat(lngVal);
        const latRef = String(tags.GPSLatitudeRef?.value || tags.GPSLatitudeRef?.description || '');
        const lngRef = String(tags.GPSLongitudeRef?.value || tags.GPSLongitudeRef?.description || '');
        if (latRef.startsWith('S') || latRef.includes('South')) {
          latitude = -latitude;
        }
        if (lngRef.startsWith('W') || lngRef.includes('West')) {
          longitude = -longitude;
        }
      }
    }

    if (tags.DateTimeOriginal?.description) {
      // EXIF date format: "YYYY:MM:DD HH:MM:SS"
      const dateStr = tags.DateTimeOriginal.description;
      const parts = dateStr.split(' ');
      if (parts.length === 2) {
        const dateParts = parts[0].split(':');
        const isoDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}T${parts[1]}`;
        capturedAt = new Date(isoDate).toISOString();
      }
    } else if (file.lastModified) {
      capturedAt = new Date(file.lastModified).toISOString();
    }

    return { latitude, longitude, capturedAt };
  } catch (error) {
    console.warn('EXIF parsing failed or no EXIF present:', error);
    return {
      capturedAt: new Date(file?.lastModified || Date.now()).toISOString(),
    };
  }
}

/**
 * Reverse geocodes latitude/longitude into City and Country using Nominatim (with fallback)
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`,
      {
        headers: {
          'User-Agent': 'SPOT-SpatialDesignIntelligence/1.0',
        },
      }
    );
    if (!response.ok) throw new Error('Geocoding request failed');
    const data = await response.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.state_district ||
      address.state ||
      'Custom Location';

    const country = address.country || 'Global';

    return {
      city,
      country,
      latitude: lat,
      longitude: lng,
    };
  } catch (error) {
    console.warn('Reverse geocoding failed, using heuristic fallback:', error);
    if (Math.abs(lat - 35.67) < 2 && Math.abs(lng - 139.76) < 2) {
      return { city: 'Tokyo', country: 'Japan', latitude: lat, longitude: lng };
    }
    if (Math.abs(lat - 48.85) < 2 && Math.abs(lng - 2.35) < 2) {
      return { city: 'Paris', country: 'France', latitude: lat, longitude: lng };
    }
    if (Math.abs(lat - 37.56) < 2 && Math.abs(lng - 126.97) < 2) {
      return { city: 'Seoul', country: 'South Korea', latitude: lat, longitude: lng };
    }
    if (Math.abs(lat - 40.71) < 2 && Math.abs(lng - (-74.00)) < 2) {
      return { city: 'New York', country: 'United States', latitude: lat, longitude: lng };
    }
    if (Math.abs(lat - 51.50) < 2 && Math.abs(lng - (-0.12)) < 2) {
      return { city: 'London', country: 'United Kingdom', latitude: lat, longitude: lng };
    }

    return {
      city: 'Custom Location',
      country: 'Global',
      latitude: lat,
      longitude: lng,
    };
  }
}

/**
 * Forward geocoding query or city name to exact Lat/Lng coordinates
 */
export async function geocodeCityOrAddress(query: string): Promise<LocationResult | null> {
  const q = query.trim();
  if (!q) return null;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&accept-language=en`, {
      headers: { 'User-Agent': 'SPOT-SpatialDesignIntelligence/1.0' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        const displayName = first.display_name || '';
        const parts = displayName.split(',').map((p: string) => p.trim());
        const city = parts[0] || q;
        const country = parts[parts.length - 1] || 'Global';
        return { city, country, latitude: lat, longitude: lng };
      }
    }
  } catch (err) {
    console.warn('Geocoding query error:', err);
  }

  // Fallback map lookup
  const coords = getCoordinatesForCity(q);
  return { city: q, country: 'Global', latitude: coords.lat, longitude: coords.lng };
}

export function getCoordinatesForCity(city: string, country?: string): { lat: number; lng: number } {
  const cityLower = (city || '').toLowerCase();
  const countryLower = (country || '').toLowerCase();

  if (cityLower.includes('seoul') || cityLower.includes('서울')) return { lat: 37.5665, lng: 126.9780 };
  if (cityLower.includes('tokyo') || cityLower.includes('도쿄')) return { lat: 35.6762, lng: 139.6503 };
  if (cityLower.includes('paris') || cityLower.includes('파리')) return { lat: 48.8566, lng: 2.3522 };
  if (cityLower.includes('new york') || cityLower.includes('뉴욕')) return { lat: 40.7128, lng: -74.0060 };
  if (cityLower.includes('london') || cityLower.includes('런던')) return { lat: 51.5074, lng: -0.1278 };
  if (cityLower.includes('milan') || cityLower.includes('밀라노')) return { lat: 45.4642, lng: 9.1900 };
  if (cityLower.includes('busan') || cityLower.includes('부산')) return { lat: 35.1796, lng: 129.0756 };

  if (countryLower.includes('korea') || countryLower.includes('한국')) return { lat: 37.5665, lng: 126.9780 };
  if (countryLower.includes('japan') || countryLower.includes('일본')) return { lat: 35.6762, lng: 139.6503 };
  if (countryLower.includes('france') || countryLower.includes('프랑스')) return { lat: 48.8566, lng: 2.3522 };
  if (countryLower.includes('states') || countryLower.includes('미국')) return { lat: 40.7128, lng: -74.0060 };

  return { lat: 37.5665, lng: 126.9780 };
}
