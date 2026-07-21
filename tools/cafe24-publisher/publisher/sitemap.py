from __future__ import annotations

import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse


NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def _parse_existing(path: Path | None) -> list[str]:
    if not path or not path.exists():
        return []
    try:
        tree = ET.parse(path)
        root = tree.getroot()
        urls: list[str] = []
        for loc in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
            if loc.text:
                urls.append(loc.text.strip())
        # also handle no-namespace
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
) -> Path:
    existing = _parse_existing(existing_path)
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
        parsed = urlparse(u)
        if not parsed.scheme:
            continue
        lines.append("  <url>")
        lines.append(f"    <loc>{u}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        lines.append("    <changefreq>weekly</changefreq>")
        lines.append("    <priority>0.7</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return output_path
