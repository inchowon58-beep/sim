# SEO 대량 발행기 (도메인별 · 로컬 → Vercel)

Vercel/VM에서 문서를 만들던 방식을 대체합니다.  
**도메인마다 다른 브랜드·디자인(a~e)** 이 기존 Next `/guide/[slug]` + 테넌트 설정으로 적용됩니다.

1. `sites.json`에 도메인 등록  
2. PC에서 도메인 선택 → 키워드 등록 → `data/seo-static/{hostname}/pages/*.json`  
3. git commit/push → **Vercel 배포**  
4. 접속: `https://{hostname}/guide/{slug}` (해당 도메인 헤더/푸터/테마)  
5. sitemap + **IndexNow**

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
python publish.py sites
python publish.py run --hostname example.com --keywords keywords.txt --count 100
python app_gui.py
```

## 출력

| 경로 | 설명 |
|------|------|
| `data/seo-static/{host}/pages/{slug}.json` | 도메인별 SEO 본문 |
| `public/seo-hosts/{host}/sitemap.xml` | 도메인별 sitemap |
| `public/seo-guides-sitemap.xml` | 통합 sitemap (폴백) |

접속 URL: `https://{host}/guide/{slug}` (`.html` 아님)

## 참고

- 예전 `public/guide/*.html` 단일 정적 방식은 도메인별 디자인을 못 씁니다. JSON + Next 라우트로 대체했습니다.
- Cafe24 FTP 도구는 사용하지 않습니다.
- 관리자 웹의 개별/대량 등록·VM 워커는 종료(410) 상태입니다.
