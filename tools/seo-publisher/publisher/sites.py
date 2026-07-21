from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass
class SiteProfile:
    hostname: str
    site_url: str
    brand_name: str
    phone: str
    site_design: str = "e"
    tagline: str = "강아지·고양이 파양 · 무료분양"


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
        sites.append(
            SiteProfile(
                hostname=host,
                site_url=url,
                brand_name=str(item.get("brandName") or item.get("brand_name") or host),
                phone=str(item.get("phone") or "010-0000-0000"),
                site_design=str(item.get("siteDesign") or item.get("site_design") or "e"),
                tagline=str(
                    item.get("tagline") or "강아지·고양이 파양 · 무료분양"
                ),
            )
        )
    return sites


def save_sites(path: Path, sites: list[SiteProfile]) -> None:
    payload = [
        {
            "hostname": s.hostname,
            "siteUrl": s.site_url,
            "brandName": s.brand_name,
            "phone": s.phone,
            "siteDesign": s.site_design,
            "tagline": s.tagline,
        }
        for s in sites
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
