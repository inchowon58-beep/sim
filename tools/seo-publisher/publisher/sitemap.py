from __future__ import annotations

import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse


def _parse_existing(path: Path | None) -> list[str]:
    if not path or not path.exists():
        return []
    try:
        root = ET.parse(path).getroot()
        urls: list[str] = []
        for loc in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
            if loc.text:
                urls.append(loc.text.strip())
        if not urls:
            for loc in root.findall(".//loc"):
                if loc.text:
                    urls.append(loc.text.strip())
        return urls
    except ET.ParseError:
        return []


def merge_and_write_sitemap(
    *,
    site_url: str,
    new_urls: list[str],
    existing_path: Path | None,
    output_path: Path,
) -> int:
    existing = _parse_existing(existing_path if existing_path else output_path)
    home = site_url.rstrip("/") + "/"
    merged: list[str] = []
    seen: set[str] = set()
    for u in [home, *existing, *new_urls]:
        u = u.strip()
        if not u or u in seen:
            continue
        seen.add(u)
        merged.append(u)

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for u in merged:
        if not urlparse(u).scheme:
            continue
        lines.extend(
            [
                "  <url>",
                f"    <loc>{u}</loc>",
                f"    <lastmod>{today}</lastmod>",
                "    <changefreq>weekly</changefreq>",
                "    <priority>0.7</priority>",
                "  </url>",
            ]
        )
    lines.append("</urlset>")
    lines.append("")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return len(merged)
