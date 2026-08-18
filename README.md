# SPOT - Global Spatial Design Intelligence

A responsive Next.js web service for capturing spatial design data, extracting multimodal AI insights from uploaded photos, and saving location-based spot records.

- GitHub repository: https://github.com/jec5500-prog/Codyssey-A1-3
- Vercel deployment URL: https://real-time-visual-sharing.vercel.app/

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

## Supabase 설정

### 1. SQL 마이그레이션 실행

Supabase 대시보드의 SQL Editor에서 다음 마이그레이션 파일을 실행합니다:

**파일:** `supabase/migrations/20260813000000_create_users_table.sql`

이 마이그레이션은:
- `public.users` 테이블 생성 (id, name, email, avatar, role, status, created_at, last_login)
- Row Level Security (RLS) 정책 설정
- Supabase Auth 가입 시 자동 프로필 생성 트리거
- 관리자(admin) 권한 관리를 위한 정책 설정

### 2. 관리자 계정 설정

1. 앱에서 회원가입
2. Supabase 대시보드 → Table Editor → `public.users` 테이블
3. 가입한 사용자의 `role` 필드를 `admin` (소문자)으로 변경
4. 앱에서 로그아웃 후 다시 로그인하면 관리자 페이지 접근 가능

### 3. 인증 시스템

- **인증 방식:** Supabase Auth (이메일/비밀번호)
- **권한 관리:** `public.users` 테이블의 `role` 필드 기반
  - `role = 'admin'`: 관리자 권한 (회원 관리 페이지 접근)
  - `role = 'user'`: 일반 사용자

## 배포 준비

1. GitHub 저장소에 코드 푸시
2. Vercel 계정으로 로그인
3. Vercel 프로젝트를 GitHub 저장소와 연결
4. **Vercel 환경 변수 등록:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN` (선택 사항)
5. Vercel에서 배포 실행
6. 배포 완료 후 Vercel URL에서 앱 접근 가능

## Vercel 배포 정보

- `vercel.json`에 `framework: "nextjs"` 및 `buildCommand: "npm run build"`가 설정됨
- `.vercelignore`를 사용하여 로컬 개발/툴 아티팩트와 불필요한 파일을 제외하도록 구성

## 추가 문서

- `SERVICE_PLAN.md`
- `DELIVERY_PLAN.md`
- `SUBMISSION_GUIDE.md`
- `.env.local.example`
