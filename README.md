# SPOT — Global Spatial Design Intelligence

공간·리테일 디자인 사진을 업로드하면 AI가 공간의 카테고리, 스타일, 색상, 재료, 조명, 구도, 오브젝트, 테마를 다각도로 분석해 주는 글로벌 공간 인텔리전스 웹 서비스입니다. 사용자는 분석 결과를 확인·수정한 뒤 디자인 스팟으로 저장하고, 탐색·지도·비교·인사이트 화면에서 활용할 수 있습니다.

---

## 1. 과제 목적 및 구현 개요

본 프로젝트는 Vercel Python Serverless Function과 Google Gemini Multimodal AI를 연동하여, 사용자가 업로드한 공간 디자인 사진을 구조화된 데이터로 자동 분석하고 **KO / EN / JA / FR / ZH / ES 6개 국어**로 실시간 탐색 및 검증할 수 있는 시스템을 구축하는 것을 목적으로 합니다.

### 핵심 구현 내용
- **Python Backend + Gemini AI 연동**: Vercel Python Serverless Function (`api/analyze.py`) 및 최신 `google-genai` SDK 기반 `gemini-3.6-flash` 모델 연동.
- **구조화된 AI 분석 파이프라인**: 이미지 Base64 인코딩 전송 → Python API 수신 및 디코딩 → Gemini Vision AI 다각도 공간 분석 → 11개 핵심 데이터 항목 + 5개 언어 번역 객체 JSON 구조화 반환.
- **Canonical Master & 동적 다국어 렌더링 파이프라인**: `rawAnalysis` Canonical English Master 데이터의 불변성을 유지하고, UI 렌더링 시점에만 활성 언어(`language`)에 따라 3단계 동적 폴백(AI Dynamic Translation → Static Dictionary → Raw Fallback)으로 렌더링.
- **위치 데이터 로컬라이징**: City/Country 입력 및 요약 정보를 DB 원본값(Canonical String) 손상 없이 선택된 언어로 실시간 번역 표시 (`translateCity`, `translateCountry`).
- **전체 UI 100% 다국어 지원**: 헤더, 네비게이션, 필터, 카드, 모달, Capture 검증 단계, Compare, Insight, Saved 전 파이프라인 6개 언어 동기화.

---

## 2. 링크 정보

- **GitHub 저장소**: [jec5500-prog/Codyssey-A1-3](https://github.com/jec5500-prog/Codyssey-A1-3)
- **과제 구현 브랜치**: `assignment/python-ai-analyze`
- **운영 버전 보존 태그**: `release-before-assignment-2026-08-18`
- **배포 URL**: [https://real-time-visual-sharing.vercel.app/](https://real-time-visual-sharing.vercel.app/)

> 과제 작업은 `assignment/python-ai-analyze` 브랜치에서만 진행되며, `main` 브랜치는 100% Clean 상태로 보존됩니다.

---

## 3. 데이터 처리 흐름 (Data Flow)

```text
[사용자 사진 업로드 / 선택]
        │ (Base64 인코딩)
        ▼
[Client: aiService.ts] ── POST /api/analyze ──► [Serverless: api/analyze.py]
                                                        │ (google-genai SDK)
                                                        ▼
[CaptureForm Stage 3 UI] ◄── HTTP 200 JSON ◄── [Gemini AI: gemini-3.6-flash]
  └─ rawAnalysis (Canonical Master) 저장            (11개 핵심 항목 + translations 객체)
  └─ 선택 언어(KO/EN/JA/FR/ZH/ES) 동적 렌더링
```

---

## 4. 기술 스택 및 SDK

- **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS
- **Backend / Serverless**: Vercel Python Serverless Function (`api/analyze.py`, Python 3.9+)
- **AI SDK & Model**: `google-genai` SDK (`>=0.1.1`), `gemini-3.6-flash` 모델
- **Data & Auth**: Supabase (PostgreSQL)
- **Map Library**: Leaflet, React-Leaflet
- **Deployment**: Vercel Deployment Platform

---

## 5. AI 분석 결과 데이터 항목

Gemini Vision AI를 통해 분석되어 구조화된 결과로 반환되는 데이터 항목은 다음과 같습니다:

| 항목 | 데이터 타입 | 설명 및 비번역/번역 처리 규칙 |
| --- | --- | --- |
| `category` | String | 공간 유형 (Window, Store Interior, Store Exterior, Pop-up Store, Street, Exhibition) |
| `brand` | String | 추정 브랜드명 (예: Gentle Monster, Chanel). **고유명사 원문 유지 (비번역)** |
| `description` | String | 공간 건축 및 VMD 디자인 컨셉 요약문 (2문장 내외) |
| `style` | String | 디자인 스타일 (예: Minimalist Brutalism, Biophilic Luxury) |
| `colors` | String Array | 대표 색상 4종 HEX 코드 (`#HEX1`~`#HEX4`) 및 Canvas 점유 비중 (%). **원문 유지 (비번역)** |
| `materials` | String Array | 주요 사용 자재 및 소재 태그 리스트 |
| `lighting` | String | 조명 설계 특징 (예: Linear Concealed Warm LED) |
| `composition` | String | 공간 구도 및 시각적 균형감 (예: Asymmetrical Monolithic Grid) |
| `objects` | String Array | 주요 오브제 및 디스플레이 집기 태그 리스트 |
| `theme` | String | 공간 테마 타이틀 (예: Urban Future Art Installation) |
| `confidence` | Number | AI 분석 신뢰도 점수 (0.00 ~ 1.00) |

---

## 6. 다국어 지원 (i18n) 및 Canonical State 분리 구조

### 지원 언어 (6 Languages)
- **KO** (한국어), **EN** (영어), **JA** (일본어), **FR** (프랑스어), **ZH** (중국어), **ES** (스페인어)

### Canonical Master State 분리 원칙
1. **원본 데이터 보존 (`rawAnalysis`)**:
   - AI 분석 수신 시 `rawAnalysis` state에 Canonical English Master 데이터를 변형 없이 저장합니다.
   - DB 저장(`handleSaveSpot`) 시 정본(Canonical) 데이터가 안전하게 저장됩니다.
2. **동적 다국어 렌더링 (`translateAnalysisField` / `translateAnalysisList`)**:
   - 화면 표시 시점에만 활성 `language`에 맞게 동적으로 텍스트를 변환합니다.
   - **1단계 (EN)**: `rawAnalysis` 원문 반환
   - **2단계 (AI Dynamic Translation)**: `rawAnalysis.translations[language]` 객체 참조 (사전에 등록되지 않은 새로 생성된 임의의 AI 텍스트도 100% 선택 언어로 렌더링)
   - **3단계 (Static Dictionary)**: `translationUtils.ts` 사전 매칭 텍스트 반환
3. **위치 정보 실시간 번역**:
   - City/Country 필드는 DB Canonical 값(예: `"Seoul"`, `"South Korea"`)을 유지하면서 UI 상에서는 선택 언어에 맞춰 실시간 로컬라이징 표기됩니다 (`translateCity`, `translateCountry`).
4. **비번역 값 유지**:
   - 브랜드 고유명사(`brand`), HEX 색상 코드 및 점유 비중(`colors`)은 어떠한 언어 설정에서도 변형되지 않습니다.

---

## 7. 주요 화면 및 기능

| 화면 | 경로 | 주요 기능 |
| --- | --- | --- |
| **Explore** | `/` | 스팟 갤러리 탐색, 6개 언어 도시/카테고리 필터링, 정렬, 검색, 상세 모달 |
| **Capture** | `/capture` | 사진 업로드/카메라/샘플 스팟, 위치 확인, AI 다각도 분석, Stage 3 동적 번역 검증 및 편집 저장 |
| **Map** | `/map` | Leaflet 지도 기반 스팟 핀 탐색 및 마커 모달 |
| **Compare** | `/compare` | 카테고리/도시별 컬러·자재·스타일 디테일 다국어 비교 엔진 |
| **Insight** | `/insight` | 공간 디자인 패턴 분석 인사이트 차트 및 대시보드 |
| **Saved / Profile** | `/saved`, `/profile` | 저장된 디자인 스팟 관리 및 사용자 프로필 |

---

## 8. 코드 및 구문 검증 (Verification Status)

본 프로젝트는 아래 3가지 자동 검증 통과를 기준으로 개발되었습니다:

- [x] **Production Build**: `npm run build` (Next.js Turbopack 16.3.0 빌드 Code 0 PASS)
- [x] **TypeScript Type Check**: `tsc --noEmit` (타입 오류 0건 PASS)
- [x] **Python Syntax & Compilation**: `python -m py_compile api/analyze.py` (파이썬 구문 오류 0건 PASS)

---

## 9. 환경 변수 설정 및 실행 방법

### 로컬 환경 변수 설정 (`.env.local`)
Vercel Serverless Function에서 Google Gemini API 호출을 처리하기 위해 필요합니다.

```ini
# .env.local
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
> **보안 준수 사항**: `GEMINI_API_KEY`는 서버측 함수(`api/analyze.py`)에서만 접근하며, 클라이언트 브라우저 코드나 public 환경 변수에는 노출되지 않습니다.

### 실행 방법

1. **의존성 설치**:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

2. **Serverless Function 포함 로컬 통합 실행**:
   ```bash
   vercel dev
   ```
   *`vercel dev` 명령을 통해 Next.js 프론트엔드와 Python `api/analyze.py` 서버리스 함수를 동시에 구동하여 통합 테스트할 수 있습니다.*

---

## 10. 구현 완료 사항 및 참고 사항 (Feature Status & Edge Cases)

### 구현 완료 사항 (Implemented & Verified)
- Python Serverless Function (`api/analyze.py`)과 Google `google-genai` SDK 연동 100% 완료
- 이미지 분석 11개 결과 항목 및 5개 언어 동적 번역 객체 수신 100% 완료
- KO / EN / JA / FR / ZH / ES 6개 언어 UI 및 AI 결과 즉시 전환 100% 완료
- AI 분석 결과의 Canonical Raw Master State 분리 및 동적 렌더링 파이프라인 적용 완료
- City / Country 위치 데이터 6개 언어 표기 및 DB 원본값 유지 처리 완료
- `npm run build`, `tsc --noEmit`, `python -m py_compile api/analyze.py` 100% 검증 통과

### 참고 및 예외 처리 사항 (Notes & Handled Edge Cases)
- **AI Timeout 처리**: 이미지 업로드 및 분석 지연 상황을 고려하여 `aiService.ts` 내 `AbortController` 타임아웃을 45초로 설정하고 타임아웃 발생 시 안전한 에러 메시지를 표출합니다.
- **이미지 업로드 초회 실패/네트워크 실패 예외**: 서버측 비밀키 미설치, 디코딩 오류, 네트워크 차단 시 가짜 데이터를 표출하지 않고 사용자에게 재시도 안내 메시지를 표시합니다.

