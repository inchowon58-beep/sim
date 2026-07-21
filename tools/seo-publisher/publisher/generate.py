from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from publisher.sites import SiteProfile


def slugify(keyword: str) -> str:
    raw = keyword.strip().lower()
    raw = re.sub(r"\s+", "-", raw)
    raw = re.sub(r"[^0-9a-zA-Z가-힣\-]+", "", raw)
    raw = re.sub(r"-+", "-", raw).strip("-")
    if not raw:
        raw = f"guide-{hashlib.md5(keyword.encode('utf-8')).hexdigest()[:12]}"
    return raw[:80]


def parse_keywords(text: str, count: int | None = None) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for line in text.splitlines():
        for part in re.split(r"[,;|]", line):
            kw = part.strip()
            if len(kw) < 2:
                continue
            key = kw.lower()
            if key in seen:
                continue
            seen.add(key)
            out.append(kw)
            if count is not None and len(out) >= count:
                return out
    return out


def read_keywords_file(path: Path, count: int | None = None) -> list[str]:
    return parse_keywords(path.read_text(encoding="utf-8"), count)


def _page_id(hostname: str, slug: str) -> str:
    digest = hashlib.md5(f"{hostname}:{slug}".encode("utf-8")).hexdigest()[:10]
    return f"static-{digest}"


def _build_content(keyword: str, brand: str, phone: str) -> str:
    return f"""
<p><strong>{keyword}</strong> 관련 파양·무료분양 안내입니다. {brand}에서 입소 절차와 매칭 상담을 도와드립니다.</p>
<h2>상담이 필요한 경우</h2>
<ul>
  <li>이민·이사·군입대 등 피치 못한 사정의 파양</li>
  <li>새 가족을 찾는 무료분양·매칭</li>
  <li>입소 비용·케어 안내</li>
</ul>
<h2>연락처</h2>
<p>전화 상담: <a href="tel:{phone}">{phone}</a></p>
<p>방문은 사전 예약제로 진행됩니다.</p>
""".strip()


def _build_faqs(keyword: str, brand: str, phone: str) -> list[dict]:
    return [
        {
            "question": f"{keyword} 상담은 어떻게 하나요?",
            "answer": f"{brand}에 전화({phone}) 또는 홈페이지로 문의해 주시면 절차를 안내합니다.",
        },
        {
            "question": "방문 없이 상담이 가능한가요?",
            "answer": "전화·온라인 상담 후 필요 시 방문 예약을 안내합니다. 방문이 어려운 경우 픽업 상담도 가능합니다.",
        },
        {
            "question": "입소·분양 비용은 어떻게 되나요?",
            "answer": "상황과 케어 내용에 따라 달라질 수 있어, 상담 시 항목별로 투명하게 안내합니다.",
        },
    ]


def generate_pages_for_site(
    *,
    site: SiteProfile,
    keywords: list[str],
    repo_root: Path,
) -> list[str]:
    """도메인별 JSON 페이지 생성 → data/seo-static/{hostname}/pages/{slug}.json
    URL은 /guide/{slug} (기존 Next 라우트 + 테넌트 디자인 적용)
    """
    if not keywords:
        raise ValueError("등록할 키워드가 없습니다.")

    host = site.hostname
    pages_dir = repo_root / "data" / "seo-static" / host / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    urls: list[str] = []
    slugs: list[str] = []

    # keep existing slugs in index
    index_path = repo_root / "data" / "seo-static" / host / "index.json"
    existing_slugs: list[str] = []
    if index_path.exists():
        try:
            existing_slugs = list(json.loads(index_path.read_text(encoding="utf-8")).get("slugs") or [])
        except json.JSONDecodeError:
            existing_slugs = []

    for i, keyword in enumerate(keywords):
        base = slugify(keyword)
        slug = base
        n = 2
        while slug in existing_slugs or slug in slugs:
            # allow overwrite if same keyword file already intended
            existing_file = pages_dir / f"{slug}.json"
            if existing_file.exists():
                try:
                    prev = json.loads(existing_file.read_text(encoding="utf-8"))
                    if prev.get("keyword") == keyword:
                        break
                except json.JSONDecodeError:
                    pass
            slug = f"{base}-{n}"
            n += 1

        page = {
            "id": _page_id(host, slug),
            "slug": slug,
            "keyword": keyword,
            "title": f"{keyword} | {site.brand_name}",
            "description": (
                f"{keyword} 안내 — {site.brand_name}에서 파양·무료분양 상담을 도와드립니다. "
                f"문의 {site.phone}"
            ),
            "content": _build_content(keyword, site.brand_name, site.phone),
            "faqs": _build_faqs(keyword, site.brand_name, site.phone),
            "imageIndex": (i % 20) + 1,
            "createdAt": now,
            "updatedAt": now,
        }
        (pages_dir / f"{slug}.json").write_text(
            json.dumps(page, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        slugs.append(slug)
        urls.append(f"{site.site_url.rstrip('/')}/guide/{slug}")

    # meta for publisher / debugging
    meta = {
        "hostname": host,
        "siteUrl": site.site_url,
        "brandName": site.brand_name,
        "phone": site.phone,
        "siteDesign": site.site_design,
        "tagline": site.tagline,
        "updatedAt": now,
    }
    (repo_root / "data" / "seo-static" / host / "site.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    merged_slugs = list(dict.fromkeys([*existing_slugs, *slugs]))
    index_path.write_text(
        json.dumps({"slugs": merged_slugs, "updatedAt": now}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    return urls
