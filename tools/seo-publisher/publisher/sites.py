from __future__ import annotations

import json
from dataclasses import dataclass, replace
from pathlib import Path


@dataclass
class SiteProfile:
    hostname: str
    site_url: str
    brand_name: str
    phone: str
    site_design: str = "e"
    tagline: str = "강아지·고양이 파양 · 무료분양"
    company_name: str = ""
    # 단일 이미지 절대 URL (모든 페이지 동일) — 예: https://cdn.example.com/hero.jpg
    image_url: str = ""
    # 폴더형 CDN (01.webp~) — 예: https://image.example.com/dogboho
    image_cdn: str = ""


def load_sites(path: Path) -> list[SiteProfile]:
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    sites: list[SiteProfile] = []
    for item in raw:
        host = str(item.get("hostname") or "").strip().lower().removeprefix("www.")
        if not host:
            continue
        url = str(item.get("siteUrl") or item.get("site_url") or f"https://{host}").rstrip("/")
        brand = str(item.get("brandName") or item.get("brand_name") or host)
        company = str(
            item.get("companyName")
            or item.get("company_name")
            or item.get("업체명")
            or brand
        )
        sites.append(
            SiteProfile(
                hostname=host,
                site_url=url,
                brand_name=brand,
                phone=str(item.get("phone") or "010-0000-0000"),
                site_design=str(item.get("siteDesign") or item.get("site_design") or "e"),
                tagline=str(
                    item.get("tagline") or "강아지·고양이 파양 · 무료분양"
                ),
                company_name=company,
                image_url=str(
                    item.get("imageUrl") or item.get("image_url") or ""
                ).strip(),
                image_cdn=str(
                    item.get("imageCdn") or item.get("image_cdn") or ""
                ).rstrip("/"),
            )
        )
    return sites


def save_sites(path: Path, sites: list[SiteProfile]) -> None:
    payload = [
        {
            "hostname": s.hostname,
            "siteUrl": s.site_url,
            "brandName": s.brand_name,
            "companyName": s.company_name or s.brand_name,
            "phone": s.phone,
            "siteDesign": s.site_design,
            "tagline": s.tagline,
            "imageUrl": s.image_url,
            "imageCdn": s.image_cdn,
        }
        for s in sites
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def with_overrides(
    site: SiteProfile,
    *,
    brand_name: str | None = None,
    company_name: str | None = None,
    phone: str | None = None,
    image_url: str | None = None,
    image_cdn: str | None = None,
) -> SiteProfile:
    updates: dict = {}
    if brand_name is not None and brand_name.strip():
        updates["brand_name"] = brand_name.strip()
    if company_name is not None and company_name.strip():
        updates["company_name"] = company_name.strip()
    if phone is not None and phone.strip():
        updates["phone"] = phone.strip()
    if image_url is not None:
        updates["image_url"] = image_url.strip()
    if image_cdn is not None:
        updates["image_cdn"] = image_cdn.strip().rstrip("/")
    return replace(site, **updates) if updates else site
