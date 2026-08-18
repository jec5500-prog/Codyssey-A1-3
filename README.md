# SPOT — Global Spatial Design Intelligence

공간·리테일 디자인 사진을 업로드하면 AI가 공간의 스타일, 색상, 재료, 조명, 구성 요소를 분석해 주는 웹 서비스입니다. 사용자는 분석 결과를 확인·수정한 뒤 디자인 스팟으로 저장하고, 탐색·지도·비교·인사이트 화면에서 활용할 수 있습니다.

## 링크

- GitHub 저장소: https://github.com/jec5500-prog/Codyssey-A1-3
- 과제 구현 브랜치: `assignment/python-ai-analyze`
- 운영 버전 보존 태그: `release-before-assignment-2026-08-18`
- 배포 URL: https://real-time-visual-sharing.vercel.app/

> 과제 관련 수정은 과제 브랜치에만 적용됩니다. 기존 운영 코드 기준점은 보존 태그로 남겨 두었습니다.

## 서비스 목적과 대상 사용자

SPOT는 현장에서 수집한 매장, 쇼윈도, 팝업 스토어, 전시 공간 사진을 분석 가능한 디자인 데이터로 전환합니다.

- 리테일 디자이너와 VMD: 현장 레퍼런스를 일관된 항목으로 기록
- 공간 디자이너와 브랜딩 기획자: 색상·재료·조명·구성 분석을 활용한 기획
- 디자인 트렌드 분석가: 지역·카테고리별 디자인 패턴 탐색과 비교

## 주요 화면

| 화면 | 경로 | 기능 |
| --- | --- | --- |
| Explore | `/` | 디자인 스팟 탐색, 검색, 필터, 정렬, 상세 보기 |
| Capture | `/capture` | 사진 업로드·모바일 카메라, 위치 확인, AI 분석, 검증·저장 |
| Map | `/map` | 지도 기반 스팟 탐색 |
| Compare | `/compare` | 지역·카테고리별 색상·재료·스타일·조명 비교 |
| Insight | `/insight` | 데이터 기반 디자인 인사이트 |
| Saved / Profile | `/saved`, `/profile` | 저장 스팟과 사용자 정보 관리 |

상단 메뉴와 모바일 하단 메뉴를 통해 주요 화면을 이동할 수 있습니다.

## AI 이미지 분석 흐름

1. 사용자가 Capture 화면에서 사진을 선택합니다.
2. 브라우저가 이미지 형식·크기를 검증하고 Base64 형식으로 준비합니다.
3. JavaScript가 `fetch('/api/analyze')`로 분석 요청을 보냅니다.
4. Vercel Python Serverless Function인 `api/analyze.py`가 서버 환경 변수의 AI 키를 사용해 Gemini API를 호출합니다.
5. 분석 결과를 화면에 반환합니다.

분석 결과에는 공간 카테고리, 브랜드 추정, 설명, 스타일, 색상 팔레트, 재료, 조명, 구성, 주요 오브젝트, 테마, 신뢰도가 포함됩니다.

## 오류·안정성 처리

- 빈 요청, 잘못된 이미지 데이터, AI API 오류: 사용자에게 안전한 오류 안내 표시
- 이미지 크기: 원본 3MB 이하, Base64 포함 요청 본문 4MB 이하
- 응답 지연: 15초 후 요청을 중단하고 재시도 안내 표시
- AI 분석 실패: 가짜 분석 결과를 표시하지 않으며, 기존 선택 이미지와 입력 상태를 유지한 채 재시도 가능
- 샘플 이미지 CORS 실패: 직접 이미지 업로드를 안내

서버 내부 예외와 비밀값은 오류 화면이나 콘솔에 표시하지 않습니다.

## 기술 스택

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Vercel Python Serverless Function (`api/analyze.py`)
- AI: Google Gemini API
- Data/Auth: Supabase
- Map: Leaflet
- Deployment: Vercel

## 프로젝트 구조

```text
.
├─ src/
│  ├─ app/                         # 화면 라우트
│  ├─ components/capture/           # 사진 등록·분석 UI
│  └─ lib/services/aiService.ts     # /api/analyze 요청 처리
├─ api/
│  └─ analyze.py                    # Python AI 분석 서버리스 함수
├─ requirements.txt                 # Python 의존성
├─ supabase/                        # DB 마이그레이션
├─ public/                          # 정적 자산
├─ vercel.json                      # Vercel 설정
└─ package.json                     # 프론트엔드 의존성·명령어
```

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
pip install -r requirements.txt
```

### 2. 로컬 환경 변수 설정

로컬 환경 파일에 AI 키를 설정합니다. 키 값은 저장소·문서·스크린샷에 기록하지 않습니다.

```text
GEMINI_API_KEY=발급받은_비밀값
```

AI 키는 서버 측 환경 변수만 사용합니다. 브라우저에 공개되는 환경 변수에는 AI 키를 설정하지 않습니다.

### 3. 실행

Python 서버리스 함수까지 함께 확인하려면 Vercel CLI로 실행합니다.

```bash
vercel dev
```

`npm run dev`는 프론트엔드 화면 확인에 사용할 수 있지만, Python 서버리스 API의 통합 테스트는 `vercel dev` 또는 Vercel Preview 배포에서 수행합니다.

## Vercel 배포

1. GitHub 저장소에서 `assignment/python-ai-analyze` 브랜치를 선택합니다.
2. Vercel 프로젝트의 Preview 환경에 `GEMINI_API_KEY`를 등록합니다.
3. Preview 배포에서 Capture 화면의 AI 분석을 검증합니다.
4. Production Branch인 `main`은 변경·병합하지 않습니다.

> 실제 비밀값은 Vercel Environment Variables에만 등록합니다. GitHub, 코드, 브라우저, 문서, 캡처에 기록하지 않습니다.

## 과제 제출 체크

- [x] 공개 GitHub 저장소와 과제 전용 브랜치
- [x] 3개 이상 메뉴·페이지
- [x] 반응형 UI 구현
- [x] 이미지 입력 → `fetch('/api/analyze')` → Python API → 결과 출력 구조
- [x] 빈 입력·파일 오류·API 오류·지연 안내
- [x] Python `api/`와 `requirements.txt`
- [ ] Vercel Preview에서 실제 AI 성공·실패 동작 확인
- [ ] 데스크톱 화면, 모바일 화면, AI 결과 화면 캡처
- [ ] AI 코딩 도구 사용 과정 증빙
- [ ] 과제 담당자에게 Next.js/React 사용 가능 여부 확인

## 과제 기술 조건에 대한 안내

이 프로젝트의 UI는 실제 서비스 구조를 유지하기 위해 Next.js/React 기반입니다. 과제에서 순수 HTML/CSS/JavaScript만을 절대 조건으로 평가한다면 해당 부분은 충족하지 않습니다. 반면 과제 브랜치에서는 사용자 입력 → `fetch` → Python Vercel Serverless Function → AI 응답 → 화면 출력 및 서버 환경 변수 기반 키 관리 흐름을 구현했습니다.
