from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Config:
    site_url: str
    brand_name: str
    phone: str
    output_dir: Path
    template_path: Path
    ftp_host: str
    ftp_user: str
    ftp_password: str
    ftp_port: int
    ftp_passive: bool
    ftp_remote_dir: str
    ftp_sitemap_dir: str
    indexnow_host: str
    indexnow_key: str
    indexnow_key_location: str
    indexnow_endpoint: str


def _req(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def load_config() -> Config:
    site_url = _req("SITE_URL", "https://example.com").rstrip("/")
    host = site_url.replace("https://", "").replace("http://", "").split("/")[0]
    key = _req("INDEXNOW_KEY", "replace-with-indexnow-key")
    return Config(
        site_url=site_url,
        brand_name=_req("BRAND_NAME", "아가펫보호소"),
        phone=_req("PHONE", "010-0000-0000"),
        output_dir=Path(_req("OUTPUT_DIR", str(ROOT / "output"))),
        template_path=Path(
            _req("TEMPLATE_PATH", str(ROOT / "templates" / "guide.html"))
        ),
        ftp_host=_req("FTP_HOST"),
        ftp_user=_req("FTP_USER"),
        ftp_password=_req("FTP_PASSWORD"),
        ftp_port=int(_req("FTP_PORT", "21") or "21"),
        ftp_passive=_req("FTP_PASSIVE", "1") not in {"0", "false", "False"},
        ftp_remote_dir=_req("FTP_REMOTE_DIR", "/www/guide"),
        ftp_sitemap_dir=_req("FTP_SITEMAP_DIR", "/www"),
        indexnow_host=_req("INDEXNOW_HOST", host),
        indexnow_key=key,
        indexnow_key_location=_req(
            "INDEXNOW_KEY_LOCATION", f"{site_url}/{key}.txt"
        ),
        indexnow_endpoint=_req(
            "INDEXNOW_ENDPOINT", "https://searchadvisor.naver.com/indexnow"
        ),
    )
