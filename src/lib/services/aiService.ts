import { SpotCategory } from '../types';

export interface SpatialAIAnalysisResult {
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
  confidence: number;
}

/**
 * Service abstraction for Multimodal AI Spatial Analysis.
 * Routes Base64 image data to Vercel Serverless Python Function (/api/analyze).
 */
export async function analyzeSpatialImage(
  imageBase64OrUrl: string,
  fileName?: string,
  lang: string = 'ko'
): Promise<SpatialAIAnalysisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64OrUrl,
        fileName: fileName || 'uploaded_spatial_photo.jpg',
        lang: lang || 'ko',
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.message || 'AI 공간 분석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      throw new Error(errorMsg);
    }

    return data as SpatialAIAnalysisResult;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('분석 시간이 초과되었습니다. (45초 타임아웃)');
    }
    throw err instanceof Error ? err : new Error('AI 분석 중 오류가 발생했습니다.');
  } finally {
    clearTimeout(timeoutId);
  }
}
