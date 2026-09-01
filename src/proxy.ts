import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Sliding window in-memory IP Rate Limiter for Next.js API Routes
const ipRequestMap = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 API requests per minute per IP

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting and security logging strictly to API endpoints (/api/*)
  if (pathname.startsWith('/api')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const now = Date.now();
    const timestamps = ipRequestMap.get(ip) || [];

    // Filter timestamps within the current sliding window
    const validTimestamps = timestamps.filter((ts) => now - ts < WINDOW_MS);

    if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      console.error(
        `[RATE_LIMIT_EXCEEDED] IP: ${ip} | Path: ${pathname} | Count: ${validTimestamps.length}/${MAX_REQUESTS_PER_WINDOW} | Time: ${new Date().toISOString()}`
      );
      return new NextResponse(
        JSON.stringify({
          error: true,
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'API 요청 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Retry-After': '60',
          },
        }
      );
    }

    validTimestamps.push(now);
    ipRequestMap.set(ip, validTimestamps);

    console.log(
      `[API_REQUEST] IP: ${ip} | Method: ${request.method} | Path: ${pathname} | Time: ${new Date().toISOString()}`
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
