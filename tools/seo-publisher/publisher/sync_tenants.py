from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import urlparse

import requests

from publisher.sites import SiteProfile, save_sites


def _req(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def resolve_api_base() -> str:
    for key in ("SEO_PUBLISHER_API_BASE", "SITE_URL", "PUBLISH_API_BASE"):
        raw = _req(key)
        if raw:
            return raw.rstrip("/")
    return ""


def resolve_secret() -> str:
    return _req("SEO_PUBLISHER_SECRET") or _req("COLLECTION_WORKER_SECRET")


def fetch_admin_sites(
    *,
    api_base: str | None = None,
    secret: str | None = None,
    timeout: float = 45.0,
) -> list[SiteProfile]:
    base = (api_base or resolve_api_base()).rstrip("/")
    token = secret if secret is not None else resolve_secret()
    if not base:
        raise RuntimeError(
            "API 주소가 없습니다. .env 에 SITE_URL 또는 SEO_PUBLISHER_API_BASE 를 넣으세요."
        )
    if not token:
        raise RuntimeError(
            "인증키가 없습니다. .env 에 COLLECTION_WORKER_SECRET "
            "(또는 SEO_PUBLISHER_SECRET) 을 관리자/Vercel과 동일하게 넣으세요."
        )

    url = f"{base}/api/seo-publisher/sites"
    res = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        timeout=timeout,
    )
    if res.status_code == 401:
        raise RuntimeError(
            "인증 실패(401). COLLECTION_WORKER_SECRET / SEO_PUBLISHER_SECRET 이 "
            "Vercel 환경변수와 같은지 확인하세요."
        )
    if not res.ok:
        raise RuntimeError(f"사이트 목록 조회 실패 HTTP {res.status_code}: {res.text[:300]}")

    data = res.json()
    rows = data.get("sites") or []
    if not isinstance(rows, list):
        raise RuntimeError("응답 형식이 올바르지 않습니다.")

    sites: list[SiteProfile] = []
    for item in rows:
        host = str(item.get("hostname") or "").strip().lower().removeprefix("www.")
        if not host:
            continue
        site_url = str(item.get("siteUrl") or f"https://{host}").rstrip("/")
        brand = str(item.get("brandName") or host)
        sites.append(
            SiteProfile(
                hostname=host,
                site_url=site_url,
                brand_name=brand,
                phone=str(item.get("phone") or "010-0000-0000"),
                site_design=str(item.get("siteDesign") or "c"),
                tagline=str(item.get("tagline") or "강아지·고양이 파양 · 무료분양"),
                company_name=str(item.get("companyName") or brand),
                image_url=str(item.get("imageUrl") or "").strip(),
                image_cdn=str(item.get("imageCdn") or "").rstrip("/"),
            )
        )
    return sites


def sync_sites_json(sites_path: Path, *, api_base: str | None = None) -> list[SiteProfile]:
    sites = fetch_admin_sites(api_base=api_base)
    if not sites:
        raise RuntimeError("관리자에 등록된 사이트가 없습니다.")
    save_sites(sites_path, sites)
    return sites


def describe_sync_target() -> str:
    base = resolve_api_base()
    if not base:
        return "(SITE_URL 미설정)"
    try:
        host = urlparse(base).hostname or base
    except Exception:
        host = base
    return host
