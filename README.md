# 동적 키워드 SEO 서브페이지 시스템

역방향 프록시 환경에서 동작하는 키워드 기반 SEO 서브페이지 생성 프레임워크입니다.

## URL 구조

| 경로 | 설명 |
|------|------|
| `/` | **아가펫스토리** 메인 (프록시) |
| `/pets` 등 | **아가펫스토리** 해당 경로 (프록시) |
| `/admin` | **관리자** — 키워드 등록·설정 (noindex) |
| `/[키워드슬러그]` | **SEO head** + 아가펫스토리 본문 |
| `/[키워드슬러그]01` | 동일 키워드 중복 시 접미사 |

## 빠른 시작

```bash
cp .env.example .env.local
npm install
npm run dev
```

- 메인(아가펫): http://localhost:3000/
- 관리자: http://localhost:3000/admin
- 샘플 SEO: http://localhost:3000/강아지-분양

## 환경 변수 (dmcmusic.co.kr 예시)

| 변수 | 예시 |
|------|------|
| `CANONICAL_BASE_URL` | `https://dmcmusic.co.kr` |
| `MAIN_PROXY_TARGET` | `https://www.agapetstory.co.kr` |
| `ADMIN_PATH` | `/admin` |
| `ENABLE_APP_LEVEL_MAIN_PROXY` | `true` (기본, `/admin`·키워드 URL 제외) |

## 동작 원리

```
/ , /pets …       → agapetstory 프록시
/admin            → 키워드 등록 UI (검색 노출 안 함)
/의정부-강아지-분양 → SEO head(키워드) + agapetstory HTML 본문
```

- **방문자**: 메인·서브 모두 아가펫스토리 화면
- **검색엔진**: 키워드 URL만 Title / Description / Canonical 별도 적용

## Nginx 역방향 프록시 예시

```nginx
server {
    listen 443 ssl;
    server_name sub.mydomain.com;

    # SEO 서브페이지 → Next.js
    location ~ ^/[^/]+$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 메인 → agapetstory
    location / {
        proxy_pass https://www.agapetstory.co.kr;
        proxy_set_header Host www.agapetstory.co.kr;
        proxy_ssl_server_name on;
    }
}
```

## 키워드 API

### 목록 조회

```bash
curl http://localhost:3000/api/keywords
```

### 키워드 추가 (페이지 자동 활성화)

```bash
curl -X POST http://localhost:3000/api/keywords \
  -H "Content-Type: application/json" \
  -d '{"baseKeyword":"반려견 훈련","title":"반려견 훈련 가이드","description":"기본 훈련 방법"}'
```

동일 키워드 재등록 시 슬러그에 `01`, `02` 접미사가 자동 부여됩니다.

### 수정 / 비활성화

```bash
curl -X PATCH "http://localhost:3000/api/keywords?slug=반려견-훈련" \
  -H "Content-Type: application/json" \
  -d '{"description":"업데이트된 설명"}'

curl -X DELETE "http://localhost:3000/api/keywords?slug=반려견-훈련"
```

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 허브 (Nginx 미구성 시)
│   ├── [slug]/page.tsx       # 동적 SEO 서브페이지
│   └── api/keywords/route.ts # 키워드 CRUD
├── components/
│   └── SeoSubpageLayout.tsx  # 본문 + JSON-LD
├── lib/
│   ├── keywords.ts           # JSON 데이터 레이어
│   ├── seo.ts                # Title/OG/Canonical 생성
│   └── slug.ts               # 슬러그·중복 접미사 로직
data/
└── keywords.json             # 키워드 콘텐츠 저장소
```

## SEO 동작

- **Title / Description**: `generateMetadata`에서 키워드별 동적 생성
- **Open Graph / Twitter Card**: 동일 메타 객체에서 파생
- **Canonical**: `X-Forwarded-Host` 또는 `CANONICAL_BASE_URL` + 현재 슬러그

## 2단계: 콘텐츠 믹서 & 랜덤 이미지

### 콘텐츠 믹서 (`src/lib/content-mixer.ts`)

- 홍보(아가펫스토리), 특징, 유래, 가이드, 팁 등 **10개 섹션 풀**에서 **4개를 무작위 선택**
- 슬러그 기반 시드로 페이지마다 고유 콘텐츠 생성 (동일 URL = 동일 결과)
- `키워드01`, `키워드02` 등 중복 페이지는 서로 다른 조합

### 랜덤 이미지 (`src/lib/image-picker.ts`)

- `public/assets/images/` 폴더 스캔 (jpg, png, webp, svg 등)
- 슬러그 시드 기반으로 hero `<img>` 매칭, `border-radius: 12px` 적용
- 환경 변수로 외부 CDN·매니페스트 지원

| 변수 | 설명 |
|------|------|
| `IMAGE_ASSETS_DIR` | 로컬 이미지 폴더 (기본: `public/assets/images`) |
| `IMAGE_ASSETS_PUBLIC_PATH` | public URL 경로 (기본: `/assets/images`) |
| `IMAGE_ASSETS_BASE_URL` | 외부 CDN 접두사 (선택) |
| `IMAGE_ASSETS_MANIFEST` | 추가 URL 목록 JSON (선택) |

### 키워드 추가 (믹서 자동 적용)

```bash
curl -X POST http://localhost:3000/api/keywords \
  -H "Content-Type: application/json" \
  -d '{"baseKeyword":"반려견 훈련"}'
```

커스텀 HTML을 직접 넣으려면 `useContentMixer: false`와 `content`를 함께 전달하세요.

## 다음 단계 (3단계 예정)

- SQLite 마이그레이션
- 관리자 UI

## 3단계: IndexNow 자동 전송 (Naver·Bing)

### 설정

1. [네이버 서치어드바이저](https://searchadvisor.naver.com) 또는 Bing Webmaster에서 **IndexNow 키** 발급
2. `public/{INDEXNOW_KEY}.txt` 파일에 키 문자열 저장 (샘플: `public/your-indexnow-key-here.txt`)
3. `.env.local` 설정:

```env
INDEXNOW_KEY=your-indexnow-key-here
CANONICAL_BASE_URL=https://sub.mydomain.com
INDEXNOW_ENABLED=true
```

### 자동 트리거

| 이벤트 | 동작 |
|--------|------|
| 키워드 **등록** (`POST /api/keywords`) | IndexNow 자동 제출 |
| 키워드 **수정** (`PATCH /api/keywords`) | IndexNow 자동 제출 |

### API

```bash
# 전송 로그 조회
curl http://localhost:3000/api/indexnow/logs

# 수동 제출
curl -X POST http://localhost:3000/api/indexnow/submit \
  -H "Content-Type: application/json" \
  -d '{"slug":"강아지-분양"}'
```

### 로그

- 파일: `data/indexnow-logs.json` (최근 500건)
- 콘솔: `[IndexNow][success|partial|failure]` 형식

### 제출 엔드포인트 (기본)

- `https://api.indexnow.org/indexnow`
- `https://www.bing.com/indexnow`
- `https://searchadvisor.naver.com/indexnow`
