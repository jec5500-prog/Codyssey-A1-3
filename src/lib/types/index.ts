export type SpotCategory =
  | 'Window'
  | 'Store Interior'
  | 'Store Exterior'
  | 'Pop-up Store'
  | 'Street'
  | 'Exhibition';

export interface User {
  id: string;
  name: string;
  avatar: string;
  created_at: string;
  email?: string;
  role?: string;
}

export interface DesignAttributes {
  spot_id: string;
  colors: string[]; // Array of hex strings e.g. ["#111111", "#F4F4F0", "#C5A059"]
  materials: string[]; // e.g. ["Brushed Stainless Steel", "Low-Iron Fluted Glass", "Unfinished Concrete"]
  style: string; // e.g. "Minimalist Brutalism", "Biophilic Luxury", "Cyberpunk Industrial"
  lighting: string; // e.g. "Linear LED Cove", "Dynamic Spot Accent", "Ambient Soft Diffuse"
  composition: string; // e.g. "Asymmetrical Grid", "Central Monolithic Focus", "Multi-layered Depth"
  objects: string[]; // Key design elements/props e.g. ["Kinetic Sculpture", "Pedestal Display", "Neon Typography"]
  theme: string; // Spatial concept theme e.g. "Future Nostalgia", "Raw Tactility", "Subtle Elegance"
}

export interface AIAnalysis {
  spot_id: string;
  analysis: {
    category: SpotCategory;
    brand: string;
    description: string;
    style: string;
    colors: string[];
    materials: string[];
    lighting: string;
    composition: string;
    objects: string[];
    theme: string;
    estimatedLocation?: {
      city: string;
      country: string;
    };
  };
  confidence: number; // 0.0 to 1.0
  is_verified: boolean;
  created_at: string;
}

export interface Spot {
  id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  image_url: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  category: SpotCategory;
  brand: string;
  description: string;
  captured_at: string; // ISO Date string
  created_at: string;  // ISO Date string
  is_verified: boolean; // Whether user confirmed/edited AI suggestions
  attributes?: DesignAttributes;
  ai_analysis?: AIAnalysis;
}

export interface SaveItem {
  id: string;
  user_id: string;
  spot_id: string;
  collection_name: string;
  created_at: string;
}

export interface Collection {
  name: string;
  count: number;
  coverImage: string;
}

export interface ComparisonMetrics {
  entityA: {
    name: string; // e.g., "Tokyo" or "Japan"
    count: number;
    topMaterials: { name: string; percentage: number }[];
    topColors: { hex: string; name: string; percentage: number }[];
    dominantStyles: { style: string; count: number }[];
    dominantLighting: { lighting: string; count: number }[];
    representativeSpots: Spot[];
  };
  entityB: {
    name: string; // e.g., "Paris" or "France"
    count: number;
    topMaterials: { name: string; percentage: number }[];
    topColors: { hex: string; name: string; percentage: number }[];
    dominantStyles: { style: string; count: number }[];
    dominantLighting: { lighting: string; count: number }[];
    representativeSpots: Spot[];
  };
  commonTraits: string[];
  keyDifferences: string[];
  summary: string;
}

export interface SpatialInsightReport {
  isSufficient: boolean;
  spotCount: number;
  scope: string; // e.g. "Global Window Displays Q3 2026"
  materialTrends: { material: string; percentage: number; insight: string }[];
  colorPaletteDistribution: { hex: string; name: string; usage: number }[];
  styleEvolution: { style: string; shift: string }[];
  lightingPreference: { type: string; ratio: number }[];
  keyTakeaways: string[];
  generated_at: string;
}
