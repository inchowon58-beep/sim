# SEO 대량 발행기 (도메인별 · 로컬 → Vercel)

Vercel/VM에서 문서를 만들던 방식을 대체합니다.  
**도메인마다 다른 브랜드·디자인(a~e)** 이 기존 Next `/guide/[slug]` + 테넌트 설정으로 적용됩니다.

1. **관리자 사이트 불러오기** 버튼으로 관리자(site_configs) 도메인·업체·전화·디자인을 `sites.json`에 저장  
   (또는 `sites.json`을 직접 작성)  
2. PC에서 도메인 선택 → 키워드 등록 → `public/seo-data/{hostname}/pages/*.json`  
3. git commit/push → **Vercel 배포**  
4. 접속: `https://{hostname}/guide/{slug}` (해당 도메인 헤더/푸터/테마)  
5. sitemap + **IndexNow**

## 관리자 사이트 불러오기

관리자 페이지에 등록된 사이트를 그대로 가져옵니다.

| 환경변수 | 설명 |
|----------|------|
| `SITE_URL` | 동기화 API 주소 (예: `https://sim-seven-woad.vercel.app`) |
| `COLLECTION_WORKER_SECRET` | Vercel과 동일한 시크릿 (또는 `SEO_PUBLISHER_SECRET`) |

GUI: **관리자 사이트 불러오기**  
CLI: `python publish.py sync-sites`

가져오는 값: 도메인(`subdomain`), 업체명(`site_name`), 전화·이미지CDN·디자인·태그라인(`content_data`)

## sites.json

`tools/seo-publisher/sites.json` (예시는 `sites.example.json`)

| 필드 | 설명 |
|------|------|
| `hostname` | Vercel에 연결된 도메인 (www 없이). Supabase `site_configs.subdomain`과 동일해야 디자인 매칭 |
| `siteUrl` | `https://...` |
| `brandName` | 페이지 제목·본문에 사용 |
| `phone` | 연락처 |
| `siteDesign` | 참고용 (`a`~`e`). 실제 UI 디자인은 DB 테넌트 `content_data.siteDesign` |

## GUI 실행파일

```bat
cd tools\seo-publisher
build_exe.bat
```

1. `.env.example` → `.env` (`INDEXNOW_KEY` 등)  
2. `sites.json`에 실제 도메인 채우기  
3. exe와 같은 폴더에 `sites.json` / `.env` 두고 실행  
4. **발행 도메인** 선택 → 키워드 → **생성 · 배포 · IndexNow**

## CLI

```bash
cd tools/seo-publisher
python publish.py sync-sites
python publish.py sites
python publish.py run --hostname example.com --keywords keywords.txt --count 100
python app_gui.py
```

## 업체명 · 이미지 · URL 확인

GUI에서 도메인 선택 후:

| 항목 | 설명 |
|------|------|
| **업체명** | 본문·제목에 사용 (`companyName`) |
| **브랜드명** | 보조 브랜드명 |
| **이미지 URL** | 히어로 이미지 절대 주소. 비우면 테넌트 CDN `01.webp`~`20.webp` |
| **생성 URL** | 실행 후 아래 상자에 `https://도메인/guide/슬러그` 목록 표시 |

`sites.json`에도 `companyName`, `imageUrl`, `imageCdn`을 넣을 수 있습니다.

## 참고

- 예전 `public/guide/*.html` 단일 정적 방식은 도메인별 디자인을 못 씁니다. JSON + Next 라우트로 대체했습니다.
- Cafe24 FTP 도구는 사용하지 않습니다.
- 관리자 웹의 개별/대량 등록·VM 워커는 종료(410) 상태입니다.
