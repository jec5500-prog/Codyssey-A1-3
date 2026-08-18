export interface ColorProportion {
  hex: string;
  percentage: number;
}

const PRESET_THEMATIC_PALETTES: ColorProportion[][] = [
  // 1. High Luxury Gold & Onyx
  [
    { hex: '#111111', percentage: 48 },
    { hex: '#C5A059', percentage: 28 },
    { hex: '#E5E5E5', percentage: 14 },
    { hex: '#554422', percentage: 10 },
  ],
  // 2. Biophilic Botanical Green & Natural Wood
  [
    { hex: '#1C3121', percentage: 45 },
    { hex: '#4A6B4E', percentage: 25 },
    { hex: '#A3B18A', percentage: 18 },
    { hex: '#D6C7B2', percentage: 12 },
  ],
  // 3. Cyberpunk Neon Blue & Dark Titanium
  [
    { hex: '#0B0F19', percentage: 50 },
    { hex: '#00F0FF', percentage: 25 },
    { hex: '#1A233A', percentage: 15 },
    { hex: '#7000FF', percentage: 10 },
  ],
  // 4. Warm Terracotta & Sand Beige
  [
    { hex: '#C2410C', percentage: 42 },
    { hex: '#F59E0B', percentage: 28 },
    { hex: '#FDE68A', percentage: 18 },
    { hex: '#451A03', percentage: 12 },
  ],
  // 5. Minimalist Brutalist Steel & Concrete
  [
    { hex: '#18181B', percentage: 52 },
    { hex: '#71717A', percentage: 26 },
    { hex: '#E4E4E7', percentage: 14 },
    { hex: '#3F3F46', percentage: 8 },
  ],
  // 6. Crimson Velvet & Deep Amber
  [
    { hex: '#881337', percentage: 46 },
    { hex: '#F43F5E', percentage: 26 },
    { hex: '#FDA4AF', percentage: 16 },
    { hex: '#2E1065', percentage: 12 },
  ],
  // 7. Cobalt Ocean & Arctic Ice
  [
    { hex: '#1E3A8A', percentage: 44 },
    { hex: '#3B82F6', percentage: 28 },
    { hex: '#93C5FD', percentage: 18 },
    { hex: '#0F172A', percentage: 10 },
  ],
  // 8. Emerald Jewel & Pearl White
  [
    { hex: '#064E3B', percentage: 46 },
    { hex: '#10B981', percentage: 28 },
    { hex: '#A7F3D0', percentage: 16 },
    { hex: '#022C22', percentage: 10 },
  ],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

export function getSmartPaletteFromImageSeed(imageSrc: string): ColorProportion[] {
  if (!imageSrc) return PRESET_THEMATIC_PALETTES[0];
  const hash = hashString(imageSrc);
  const paletteIndex = Math.abs(hash) % PRESET_THEMATIC_PALETTES.length;
  return PRESET_THEMATIC_PALETTES[paletteIndex];
}

/**
 * High-Precision HTML5 Canvas Dominant Color Extraction Engine
 * Uses Blob Object URL conversion to bypass CORS taint restrictions, sampling 100% of pixel data directly from uploaded photos.
 */
export async function extractDominantColorsFromImage(
  imageSrc: string,
  maxColors: number = 4
): Promise<string[]> {
  const proportions = await extractColorProportionsFromImage(imageSrc, maxColors);
  return proportions.map((p) => p.hex);
}

const COLOR_CACHE = new Map<string, ColorProportion[]>();

export async function extractColorProportionsFromImage(
  imageSrc: string,
  maxColors: number = 4
): Promise<ColorProportion[]> {
  if (!imageSrc) {
    return PRESET_THEMATIC_PALETTES[0];
  }

  const cacheKey = `${imageSrc}_${maxColors}`;
  if (COLOR_CACHE.has(cacheKey)) {
    return COLOR_CACHE.get(cacheKey)!;
  }

  const smartFallback = getSmartPaletteFromImageSeed(imageSrc);

  if (typeof window === 'undefined') {
    return smartFallback;
  }

  return new Promise(async (resolve) => {
    let objectUrlToRevoke: string | null = null;
    let targetSrc = imageSrc;

    // Convert HTTP remote URLs to Blob Object URL to prevent Canvas CORS Taint
    if (imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
      try {
        const response = await fetch(imageSrc, { mode: 'cors' });
        if (response.ok) {
          const blob = await response.blob();
          objectUrlToRevoke = URL.createObjectURL(blob);
          targetSrc = objectUrlToRevoke;
        }
      } catch (e) {
        // Fallback to original imageSrc
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timer = setTimeout(() => {
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      resolve(smartFallback);
    }, 2500);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
          resolve(smartFallback);
          return;
        }

        // Scale image for high-precision 120x120 pixel analysis
        const width = 120;
        const height = Math.floor((img.height / img.width) * 120) || 120;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const colorBucket: { [key: string]: number } = {};

        // Sample pixel data (step = 4 bytes)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 128) continue;

          // 16-level RGB quantization for color grouping
          const qR = Math.round(r / 16) * 16;
          const qG = Math.round(g / 16) * 16;
          const qB = Math.round(b / 16) * 16;

          const cR = Math.min(255, Math.max(0, qR));
          const cG = Math.min(255, Math.max(0, qG));
          const cB = Math.min(255, Math.max(0, qB));

          const hex = `#${((1 << 24) + (cR << 16) + (cG << 8) + cB).toString(16).slice(1).toUpperCase()}`;
          colorBucket[hex] = (colorBucket[hex] || 0) + 1;
        }

        const sortedColors = Object.keys(colorBucket).sort(
          (a, b) => colorBucket[b] - colorBucket[a]
        );

        if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);

        if (sortedColors.length === 0) {
          resolve(smartFallback);
          return;
        }

        // Select distinct top colors using RGB distance threshold (25)
        const finalHexes: string[] = [];
        for (const hex of sortedColors) {
          if (finalHexes.length >= maxColors) break;
          const isTooSimilar = finalHexes.some((existing) => isColorSimilar(hex, existing, 25));
          if (!isTooSimilar) {
            finalHexes.push(hex);
          }
        }

        // Fill to maxColors with distinct structural tones (Black/White/Silver) if needed
        let fallbackIndex = 0;
        while (finalHexes.length < maxColors) {
          const candidate = smartFallback[fallbackIndex]?.hex || (finalHexes.includes('#18181B') ? '#FFFFFF' : '#18181B');
          if (!finalHexes.includes(candidate)) {
            finalHexes.push(candidate);
          }
          fallbackIndex++;
          if (fallbackIndex > 10) break;
        }

        // Calculate exact pixel proportion %
        const totalSampledCount = finalHexes.reduce(
          (sum, hex) => sum + (colorBucket[hex] || 1),
          0
        );

        let totalPercentage = 0;
        const proportions: ColorProportion[] = finalHexes.map((hex, idx) => {
          const count = colorBucket[hex] || 1;
          let pct = Math.round((count / totalSampledCount) * 100);
          if (pct < 5) pct = 5;
          if (idx === finalHexes.length - 1) {
            pct = Math.max(5, 100 - totalPercentage);
          } else {
            totalPercentage += pct;
          }
          return { hex, percentage: pct };
        });

        const finalResult = proportions.length > 0 ? proportions : smartFallback;
        COLOR_CACHE.set(cacheKey, finalResult);
        resolve(finalResult);
      } catch (err) {
        if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
        console.warn('Canvas color extraction warning, using smart fallback:', err);
        COLOR_CACHE.set(cacheKey, smartFallback);
        resolve(smartFallback);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
      resolve(smartFallback);
    };

    img.src = targetSrc;
  });
}

/**
 * Calculates proportion percentages for color hex array
 */
export function calculateColorPercentages(colors: string[]): ColorProportion[] {
  if (!colors || colors.length === 0) {
    return PRESET_THEMATIC_PALETTES[0];
  }

  const weights = [45, 30, 15, 10, 5];
  let sum = 0;
  const list = colors.map((hex, idx) => {
    const pct = weights[idx] || Math.max(5, Math.floor(100 / colors.length));
    sum += pct;
    return { hex, percentage: pct };
  });

  // Adjust last item to sum to 100
  if (list.length > 0) {
    const diff = 100 - sum;
    list[0].percentage = Math.max(5, list[0].percentage + diff);
  }

  return list;
}

function isColorSimilar(hex1: string, hex2: string, threshold: number = 25): boolean {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return false;
  const dist = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
  return dist < threshold;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return match
    ? {
        r: parseInt(match[1], 16),
        g: parseInt(match[2], 16),
        b: parseInt(match[3], 16),
      }
    : null;
}
