import { SpotCategory } from '../types';

export class AnalysisApiError extends Error {
  status: number;
  code?: string;
  retryable: boolean;
  constructor(message: string, status: number, code?: string, retryable = false) {
    super(message);
    this.name = 'AnalysisApiError';
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

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
  translations?: Record<string, {
    category?: string;
    description?: string;
    style?: string;
    materials?: string[];
    lighting?: string;
    composition?: string;
    objects?: string[];
    theme?: string;
  }>;
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
  const timeoutId = setTimeout(() => controller.abort(), 90000);

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

    const data = await response.json().catch(() => ({
      error: true,
      message: `AI 서버가 올바르지 않은 응답을 반환했습니다. (HTTP ${response.status})`,
    }));

    if (!response.ok || data.error) {
      const errorMsg = data.message || 'AI 공간 분석 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      const retryable = data.retryable !== undefined
        ? Boolean(data.retryable)
        : (response.status === 429 || response.status === 503);
      throw new AnalysisApiError(errorMsg, response.status, data.code, retryable);
    }

    return data as SpatialAIAnalysisResult;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('분석 시간이 초과되었습니다. (90초 타임아웃)');
    }
    throw err instanceof Error ? err : new Error('AI 분석 중 오류가 발생했습니다.');
  } finally {
    clearTimeout(timeoutId);
  }
}
