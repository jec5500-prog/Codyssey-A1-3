# SPOT - Global Spatial Design Intelligence

A responsive Next.js web service for capturing spatial design data, extracting multimodal AI insights from uploaded photos, and saving location-based spot records.

- GitHub repository: https://github.com/jec5500-prog/Codyssey-A1-3
- Vercel deployment URL: https://real-time-visaul-sharing.vercel.app/

## 주요 기능

- 사진 업로드 및 모바일 카메라 촬영 지원
- AI를 이용한 이미지 분석 (컬러, 스타일, 재료, 조명, 공간 키워드)
- EXIF GPS 또는 수동 지도 핀 위치 등록
- 스팟 비교, 인사이트 대시보드, 저장된 스팟 보기
- Supabase 연동을 위한 환경 변수 지원

## 기술 스택

- Next.js 16
- React 19
- Tailwind CSS
- Google Gemini AI (`@google/genai`)
- Supabase 클라이언트 (`@supabase/supabase-js`)
- Leaflet 지도

## 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 환경 변수

로컬 개발과 Vercel 배포를 위해 `.env.local` 파일을 다음 예시대로 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-public-token
```

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase DB/Auth/Storage
- `NEXT_PUBLIC_GEMINI_API_KEY` / `GEMINI_API_KEY`: Google Gemini AI 이미지 분석
- `NEXT_PUBLIC_MAPBOX_TOKEN`: 지도 표시용 Mapbox 토큰 (선택 사항)

## 배포 준비

1. GitHub 저장소에 코드 푸시
2. Vercel 계정으로 로그인
3. Vercel 프로젝트를 GitHub 저장소와 연결
4. Vercel 환경 변수에 `.env.local.example` 항목을 등록
5. Vercel에서 `npm run build`로 배포 실행
6. 배포가 완료되면 생성된 Vercel URL을 본 `README.md` 상단에 추가

## Vercel 배포 정보

- `vercel.json`에 `framework: "nextjs"` 및 `buildCommand: "npm run build"`가 설정됨
- `.vercelignore`를 사용하여 로컬 개발/툴 아티팩트와 불필요한 파일을 제외하도록 구성

## 추가 문서

- `SERVICE_PLAN.md`
- `DELIVERY_PLAN.md`
- `SUBMISSION_GUIDE.md`
- `.env.local.example`
