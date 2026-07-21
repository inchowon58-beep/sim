from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from publisher.cdn_images import CdnImagePool, resolve_cdn_base
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


def _display_name(site: SiteProfile) -> str:
    return (site.company_name or site.brand_name).strip() or site.brand_name


def _looks_like_image_file(url: str) -> bool:
    path = url.split("?", 1)[0].rstrip("/")
    lower = path.lower()
    return lower.endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".svg")
    )


def _resolve_single_file_url(site: SiteProfile) -> str | None:
    single = (site.image_url or "").strip()
    if not single.startswith("http://") and not single.startswith("https://"):
        return None
    if single.endswith("/") or not _looks_like_image_file(single):
        return None
    return single


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
) -> tuple[list[str], dict]:
    """도메인별 JSON 페이지 생성 → data/seo-static/{hostname}/pages/{slug}.json
    반환: (urls, image_info)
    """
    if not keywords:
        raise ValueError("등록할 키워드가 없습니다.")

    host = site.hostname
    brand = _display_name(site)
    pages_dir = repo_root / "data" / "seo-static" / host / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    urls: list[str] = []
    slugs: list[str] = []

    image_info: dict = {"mode": "default", "cdnBase": None, "imageCount": None}

    single_file = _resolve_single_file_url(site)
    cdn_pool: CdnImagePool | None = None

    if single_file:
        image_info = {"mode": "single", "url": single_file, "cdnBase": None, "imageCount": 1}
    else:
        cdn_base = resolve_cdn_base(site.image_url, site.image_cdn)
        if cdn_base:
            cdn_pool = CdnImagePool(cdn_base)
            image_info = {
                "mode": "cdn_random",
                "cdnBase": cdn_base,
                "imageCount": cdn_pool.count,
            }

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

        image_url: str | None = None
        image_index: int | None = None

        if single_file:
            image_url = single_file
        elif cdn_pool:
            image_url = cdn_pool.random_url()
        else:
            image_index = (i % 20) + 1

        page: dict = {
            "id": _page_id(host, slug),
            "slug": slug,
            "keyword": keyword,
            "title": f"{keyword} | {brand}",
            "description": (
                f"{keyword} 안내 — {brand}에서 파양·무료분양 상담을 도와드립니다. "
                f"문의 {site.phone}"
            ),
            "content": _build_content(keyword, brand, site.phone),
            "faqs": _build_faqs(keyword, brand, site.phone),
            "createdAt": now,
            "updatedAt": now,
        }
        if image_url:
            page["imageUrl"] = image_url
        if image_index is not None:
            page["imageIndex"] = image_index

        (pages_dir / f"{slug}.json").write_text(
            json.dumps(page, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        slugs.append(slug)
        urls.append(f"{site.site_url.rstrip('/')}/guide/{slug}")

    meta = {
        "hostname": host,
        "siteUrl": site.site_url,
        "brandName": site.brand_name,
        "companyName": site.company_name or site.brand_name,
        "phone": site.phone,
        "siteDesign": site.site_design,
        "tagline": site.tagline,
        "imageUrl": site.image_url,
        "imageCdn": site.image_cdn,
        "imageMode": image_info.get("mode"),
        "imageCount": image_info.get("imageCount"),
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

    last_urls = repo_root / "data" / "seo-static" / host / "_last_urls.txt"
    last_urls.write_text("\n".join(urls) + ("\n" if urls else ""), encoding="utf-8")
    return urls, image_info
