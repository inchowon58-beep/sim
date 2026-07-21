from __future__ import annotations

import random
from functools import lru_cache

import requests

DEFAULT_FALLBACK_COUNT = 20
MAX_PROBE = 200
PROBE_TIMEOUT = 10


def _format_cdn_filename(num: int, ext: str = "webp") -> str:
    return f"{num:02d}.{ext}"


def cdn_image_url(base: str, num: int, ext: str = "webp") -> str:
    return f"{base.rstrip('/')}/{_format_cdn_filename(num, ext)}"


def _url_exists(url: str, timeout: float = PROBE_TIMEOUT) -> bool:
    headers = {"User-Agent": "SEO-Publisher/1.0"}
    try:
        res = requests.head(url, headers=headers, timeout=timeout, allow_redirects=True)
        if res.status_code == 405:
            res = requests.get(url, headers=headers, timeout=timeout, stream=True, allow_redirects=True)
            res.close()
        return res.status_code == 200
    except requests.RequestException:
        return False


@lru_cache(maxsize=32)
def probe_cdn_image_count(base_url: str, max_probe: int = MAX_PROBE) -> int:
    """CDN 폴더에서 01.webp, 02.webp … 순서로 HEAD 확인 → 연속 개수."""
    base = base_url.rstrip("/")
    if not base.startswith("http"):
        return DEFAULT_FALLBACK_COUNT

    count = 0
    for n in range(1, max_probe + 1):
        url = cdn_image_url(base, n)
        if _url_exists(url):
            count = n
        elif count > 0:
            break

    if count > 0:
        return count
    return DEFAULT_FALLBACK_COUNT


class CdnImagePool:
    """확인된 CDN 이미지 개수 범위에서 랜덤 URL 선택."""

    def __init__(self, base_url: str, count: int | None = None) -> None:
        self.base = base_url.rstrip("/")
        self.count = count if count is not None else probe_cdn_image_count(self.base)

    def random_url(self) -> str:
        n = random.randint(1, self.count)
        return cdn_image_url(self.base, n)

    def random_urls(self, n: int) -> list[str]:
        return [self.random_url() for _ in range(n)]


def _looks_like_image_file(url: str) -> bool:
    path = url.split("?", 1)[0].rstrip("/")
    lower = path.lower()
    return lower.endswith(
        (".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".svg")
    )


def resolve_cdn_base(site_image_url: str, site_image_cdn: str) -> str | None:
    single = (site_image_url or "").strip()
    cdn = (site_image_cdn or "").strip().rstrip("/")

    if single.startswith("http://") or single.startswith("https://"):
        if single.endswith("/") or not _looks_like_image_file(single):
            return single.rstrip("/")
        return None

    if cdn.startswith("http://") or cdn.startswith("https://"):
        return cdn
    return None
