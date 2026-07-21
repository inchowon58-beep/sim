# SEO 발행 아키텍처 (도메인별)

## 흐름

```
키워드 입력 (SEO발행.exe / GUI) + 도메인 선택
    → data/seo-static/{hostname}/pages/{slug}.json 생성
    → public/seo-hosts/{hostname}/sitemap.xml 갱신
    → git push (main + production) → Vercel 배포
    → 방문자가 https://{hostname}/guide/{slug} 접속
       → Host로 테넌트(디자인 a~e)·브랜드 결정
       → JSON 페이지 본문 표시
    → IndexNow POST (해당 도메인 URL)
```

한 Vercel 프로젝트에 도메인이 여러 개여도, **hostname마다 폴더가 갈라지므로**
각 도메인에서 자기 페이지·자기 헤더/푸터 디자인이 나옵니다.

## 도구

[`tools/seo-publisher`](../tools/seo-publisher/README.md)

- `sites.json`에 Vercel에 묶인 도메인·브랜드·siteDesign 등록
- `build_exe.bat` → `SEO발행.exe`
- `python app_gui.py` / `python publish.py run --hostname ...`

## Vercel에서 종료된 것

개별·대량 등록 API, SEO/수집/네이버 등록 VM 워커는 HTTP 410입니다.
