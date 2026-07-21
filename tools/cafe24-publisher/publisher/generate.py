from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path


def _slugify(keyword: str) -> str:
    raw = keyword.strip().lower()
    raw = re.sub(r"\s+", "-", raw)
    raw = re.sub(r"[^0-9a-zA-Z가-힣\-]+", "", raw)
    raw = re.sub(r"-+", "-", raw).strip("-")
    if not raw:
        raw = hashlib.md5(keyword.encode("utf-8")).hexdigest()[:10]
    # keep filesystem-safe ascii fallback when Hangul-only
    if not re.search(r"[0-9a-zA-Z]", raw):
        digest = hashlib.md5(keyword.encode("utf-8")).hexdigest()[:12]
        return f"guide-{digest}"
    return raw[:80]


def _read_keywords(path: Path, count: int) -> list[str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    seen: set[str] = set()
    out: list[str] = []
    for line in lines:
        for part in re.split(r"[,;|]", line):
            kw = part.strip()
            if len(kw) < 2:
                continue
            key = kw.lower()
            if key in seen:
                continue
            seen.add(key)
            out.append(kw)
            if len(out) >= count:
                return out
    return out


def generate_html_batch(
    *,
    keywords_path: Path,
    out_dir: Path,
    site_url: str,
    brand_name: str,
    phone: str,
    count: int = 1000,
    template_path: Path,
) -> list[str]:
    if not keywords_path.exists():
        raise FileNotFoundError(f"keywords file not found: {keywords_path}")
    if not template_path.exists():
        raise FileNotFoundError(f"template not found: {template_path}")

    template = template_path.read_text(encoding="utf-8")
    keywords = _read_keywords(keywords_path, count)
    if not keywords:
        raise ValueError("no keywords found")

    out_dir.mkdir(parents=True, exist_ok=True)
    html_dir = out_dir / "html"
    html_dir.mkdir(parents=True, exist_ok=True)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    urls: list[str] = []

    for keyword in keywords:
        slug = _slugify(keyword)
        title = f"{keyword} | {brand_name}"
        description = (
            f"{keyword} 안내 — {brand_name}에서 파양·무료분양 상담을 도와드립니다. "
            f"문의 {phone}"
        )
        html = (
            template.replace("{{KEYWORD}}", keyword)
            .replace("{{TITLE}}", title)
            .replace("{{DESCRIPTION}}", description)
            .replace("{{BRAND}}", brand_name)
            .replace("{{PHONE}}", phone)
            .replace("{{SLUG}}", slug)
            .replace("{{SITE_URL}}", site_url.rstrip("/"))
            .replace("{{DATE}}", now)
        )
        file_path = html_dir / f"{slug}.html"
        file_path.write_text(html, encoding="utf-8")
        urls.append(f"{site_url.rstrip('/')}/guide/{slug}.html")

    return urls
