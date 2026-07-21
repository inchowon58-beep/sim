from __future__ import annotations

import ftplib
from pathlib import Path


def _ensure_remote_dirs(ftp: ftplib.FTP, remote_dir: str) -> None:
    parts = [p for p in remote_dir.replace("\\", "/").split("/") if p]
    path = ""
    for part in parts:
        path += f"/{part}"
        try:
            ftp.mkd(path)
        except ftplib.error_perm:
            pass
    ftp.cwd(remote_dir if remote_dir.startswith("/") else f"/{remote_dir}")


def upload_directory(
    *,
    local_dir: Path,
    remote_dir: str,
    host: str,
    user: str,
    password: str,
    port: int = 21,
    passive: bool = True,
    pattern: str = "*.html",
) -> int:
    if not host or not user:
        raise ValueError("FTP_HOST / FTP_USER 가 필요합니다. .env를 확인하세요.")

    # Prefer html/ subfolder when uploading pages
    search_root = local_dir / "html" if (local_dir / "html").is_dir() and pattern.endswith(
        ".html"
    ) else local_dir
    files = sorted(search_root.glob(pattern))
    if pattern == "sitemap.xml":
        files = sorted(local_dir.glob("sitemap.xml"))

    if not files:
        raise FileNotFoundError(f"업로드할 파일이 없습니다: {search_root}/{pattern}")

    ftp = ftplib.FTP()
    ftp.connect(host, port, timeout=60)
    ftp.login(user, password)
    ftp.set_pasv(passive)
    try:
        _ensure_remote_dirs(ftp, remote_dir)
        count = 0
        for path in files:
            with path.open("rb") as fh:
                ftp.storbinary(f"STOR {path.name}", fh)
            count += 1
            if count % 50 == 0:
                print(f"  ... {count}/{len(files)}")
        return count
    finally:
        try:
            ftp.quit()
        except Exception:
            ftp.close()
