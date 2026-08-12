# 제출 준비 계획서

## 1. 현재 상태 요약

### 완료된 항목
- Next.js 기반 웹 앱이 구성되어 있음.
- 최소 3개 이상의 페이지/섹션이 존재함.
  - `/` (Explore), `/capture`, `/compare`, `/insight`, `/map`, `/profile`, `/saved` 등.
- AI 기능이 포함되어 있음.
  - `src/lib/services/aiService.ts`에서 `@google/genai`를 사용한 Gemini 분석 기능이 구현되어 있음.
- 환경 변수 템플릿 파일 `.env.local.example`이 존재함.
- 로컬 및 Supabase 연동을 위한 `src/lib/services/dbService.ts`가 있음.

### 미완료/검토가 필요한 항목
- `README.md`가 기본 Next.js 템플릿 상태로, 서비스 소개 및 배포/환경 변수 정보가 부족함.
- `src/app/api/` 형태의 명시적인 백엔드 API 엔드포인트가 없음.
  - 최종 제출 조건에서 프론트(HTML/CSS/JS)와 백엔드(`/api/`) 구조 구분이 요구됨.
- 배포된 Vercel URL이 없음.
- GitHub 저장소 업로드 여부가 검증되지 않음.
- 서비스 기획서(목적, 타겟, 페이지 구성, 핵심 기능, AI 입력/출력/실패 처리 기준)가 없음.
- 증빙 자료(데스크톱/모바일/AI 기능 스크린샷 + AI 도구 사용 과정)가 없음.

## 2. 추가로 진행되어야 할 작업

### 2.1 Vercel 배포 및 URL 확보
- Vercel에 프로젝트 연결하고 배포하기.
- `.env.local.example`에 정의된 환경 변수를 Vercel 환경 변수로 등록하기.
- 배포된 URL을 `README.md`에 명시하기.

### 2.2 백엔드 API 구조 명확화
- `src/app/api/` 폴더를 생성하여 서버 API 엔드포인트를 추가하기.
  - 예: `src/app/api/ai/route.ts` → AI 이미지 분석 호출.
  - 예: `src/app/api/spots/route.ts` → 스팟 조회/생성/업데이트/삭제.
- 클라이언트는 가능한 한 `/api/...` 엔드포인트를 호출하도록 수정.
- 백엔드 로직은 `src/lib/services/*`로 분리 유지.

### 2.3 README 개선
- `README.md`에 다음 항목 추가:
  - 서비스 소개 및 핵심 기능 요약
  - 사용 기술 스택
  - 로컬 실행 방법 (`npm install`, `npm run dev`)
  - 배포 방법 및 Vercel URL
  - 환경 변수 설정 방법과 `.env.local.example` 설명
  - GitHub 저장소 링크

### 2.4 서비스 기획서 작성
- 새로운 문서 `SERVICE_PLAN.md` 또는 `SERVICE_BRIEF.md` 작성.
- 포함 내용:
  - 서비스 목적
  - 타겟 사용자
  - 페이지 구성 및 네비게이션 흐름
  - 핵심 기능 목록
  - AI 기능 입력/출력/실패 처리 기준

### 2.5 증빙 자료 준비
- 스크린샷 디렉터리 `screenshots/` 생성.
- 필요한 스크린샷:
  - 데스크톱 화면
  - 모바일 반응형 화면
  - AI 기능 입력 → 결과 출력 장면
- AI 도구 사용 과정 증빙:
  - 대화 로그 요약 또는 캡처 이미지
  - 현재 ChatGPT/코드 작업 로그 요약

### 2.6 검증 및 QA
- 모바일 반응형 확인.
- 최소 3개 페이지 메뉴 이동 테스트.
- AI 기능 실제 동작 확인.
- 배포 후 Vercel URL 접속 확인.
- GitHub 저장소 커밋/푸시 확인.

## 3. 권장 작업 우선순위
1. `README.md` 수정 및 환경 변수 안내 추가
2. Vercel 배포 및 URL 확보
3. API 엔드포인트 구조 추가 및 클라이언트 연동
4. 서비스 기획서 작성
5. 증빙 자료 캡처 및 정리
6. 최종 QA 및 제출 패키지 점검

## 4. 파일 생성 제안
- `README.md` (업데이트)
- `SERVICE_PLAN.md` (기획서)
- `DELIVERY_PLAN.md` (이 계획서)
- `screenshots/desktop.png`
- `screenshots/mobile.png`
- `screenshots/ai-flow.png`
- `evidence-log.md` 또는 `AI_TOOL_LOG.md`

## 5. 참고: 현재 확인된 핵심 누락 사항
- 배포 URL: 없음
- GitHub 업로드 확인: 없음
- `README.md` 서비스/배포/환경 변수 내용 미흡
- 백엔드 API 폴더(`src/app/api/`) 없음
- 기획서 문서 없음
- 증빙 자료 없음

---

위 계획서를 기준으로 우선순위 순서대로 작업을 진행하면, 최종 제출 요건을 충족하는 방향으로 프로젝트를 완성할 수 있습니다.