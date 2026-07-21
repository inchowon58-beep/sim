from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlparse

from publisher.sites import SiteProfile, load_sites


def _tool_root() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)  # type: ignore[attr-defined]
    return Path(__file__).resolve().parent.parent


def _find_repo_root() -> Path:
    env = (os.getenv("REPO_ROOT") or "").strip()
    if env:
        return Path(env).resolve()

    starts: list[Path] = []
    if getattr(sys, "frozen", False):
        starts.append(Path(sys.executable).resolve().parent)
    starts.append(Path(__file__).resolve().parent)
    starts.append(Path.cwd())

    for start in starts:
        cur = start
        for _ in range(8):
            if (cur / "package.json").exists() and (cur / "public").exists():
                return cur
            if cur.parent == cur:
                break
            cur = cur.parent

    return Path(__file__).resolve().parent.parent.parent


TOOL_ROOT = _tool_root()
REPO_ROOT = _find_repo_root()


@dataclass
class Config:
    repo_root: Path
    sites_path: Path
    sites: list[SiteProfile]
    seo_static_root: Path
    sitemap_root: Path
    indexnow_key: str
    indexnow_endpoint: str
    git_remote: str
    git_branch_main: str
    git_branch_production: str
    auto_push: bool


def _req(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def _host_from_url(url: str) -> str:
    try:
        return urlparse(url).hostname or ""
    except Exception:
        return url.replace("https://", "").replace("http://", "").split("/")[0]


def _resolve_sites_path(repo: Path) -> Path:
    env = _req("SITES_PATH")
    candidates: list[Path] = []
    if env:
        candidates.append(Path(env))
    if getattr(sys, "frozen", False):
        candidates.append(Path(sys.executable).resolve().parent / "sites.json")
    candidates.append(TOOL_ROOT / "sites.json")
    candidates.append(repo / "tools" / "seo-publisher" / "sites.json")
    for path in candidates:
        if path.exists():
            return path
    return candidates[0]


def load_config() -> Config:
    repo = _find_repo_root()
    sites_path = _resolve_sites_path(repo)
    sites = load_sites(sites_path)

    # sites.json 없으면 .env 단일 사이트로 폴백
    if not sites:
        site_url = _req("SITE_URL", "https://sim-seven-woad.vercel.app").rstrip("/")
        host = _req("INDEXNOW_HOST") or _host_from_url(site_url)
        sites = [
            SiteProfile(
                hostname=host.lower().removeprefix("www."),
                site_url=site_url,
                brand_name=_req("BRAND_NAME", "아가펫보호소"),
                phone=_req("PHONE", "010-0000-0000"),
                site_design=_req("SITE_DESIGN", "e"),
            )
        ]

    return Config(
        repo_root=repo,
        sites_path=sites_path,
        sites=sites,
        seo_static_root=repo / "public" / "seo-data",
        sitemap_root=repo / "public" / "seo-hosts",
        indexnow_key=_req("INDEXNOW_KEY", ""),
        indexnow_endpoint=_req(
            "INDEXNOW_ENDPOINT", "https://searchadvisor.naver.com/indexnow"
        ),
        git_remote=_req("GIT_REMOTE", "origin"),
        git_branch_main=_req("GIT_BRANCH_MAIN", "main"),
        git_branch_production=_req("GIT_BRANCH_PRODUCTION", "production"),
        auto_push=_req("AUTO_PUSH", "1") not in {"0", "false", "False"},
    )


def find_site(cfg: Config, hostname: str | None) -> SiteProfile:
    if not cfg.sites:
        raise RuntimeError("등록된 사이트가 없습니다. sites.json을 확인하세요.")
    if not hostname:
        return cfg.sites[0]
    key = hostname.strip().lower().removeprefix("www.")
    for s in cfg.sites:
        if s.hostname == key:
            return s
    raise RuntimeError(f"사이트를 찾을 수 없습니다: {hostname}")
