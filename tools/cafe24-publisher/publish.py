"""카페24 FTP + IndexNow SEO 대량 발행 CLI.

사용 예:
  python publish.py generate --keywords keywords.txt --count 1000
  python publish.py upload
  python publish.py sitemap
  python publish.py indexnow
  python publish.py all --keywords keywords.txt --count 1000
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from publisher.generate import generate_html_batch  # noqa: E402
from publisher.ftp_upload import upload_directory  # noqa: E402
from publisher.sitemap import merge_and_write_sitemap  # noqa: E402
from publisher.indexnow import submit_indexnow  # noqa: E402
from publisher.config import load_config  # noqa: E402


def cmd_generate(args: argparse.Namespace) -> int:
    cfg = load_config()
    keywords_path = Path(args.keywords)
    out_dir = Path(args.out or cfg.output_dir)
    urls = generate_html_batch(
        keywords_path=keywords_path,
        out_dir=out_dir,
        site_url=cfg.site_url,
        brand_name=cfg.brand_name,
        phone=cfg.phone,
        count=args.count,
        template_path=Path(args.template) if args.template else cfg.template_path,
    )
    manifest = out_dir / "urls.txt"
    manifest.write_text("\n".join(urls) + ("\n" if urls else ""), encoding="utf-8")
    print(f"[ok] generated {len(urls)} html files → {out_dir}")
    print(f"[ok] url list → {manifest}")
    return 0


def cmd_upload(args: argparse.Namespace) -> int:
    cfg = load_config()
    out_dir = Path(args.out or cfg.output_dir)
    uploaded = upload_directory(
        local_dir=out_dir,
        remote_dir=cfg.ftp_remote_dir,
        host=cfg.ftp_host,
        user=cfg.ftp_user,
        password=cfg.ftp_password,
        port=cfg.ftp_port,
        passive=cfg.ftp_passive,
        pattern=args.pattern,
    )
    print(f"[ok] uploaded {uploaded} files to ftp://{cfg.ftp_host}{cfg.ftp_remote_dir}")
    return 0


def cmd_sitemap(args: argparse.Namespace) -> int:
    cfg = load_config()
    out_dir = Path(args.out or cfg.output_dir)
    urls_file = Path(args.urls or (out_dir / "urls.txt"))
    urls = [u.strip() for u in urls_file.read_text(encoding="utf-8").splitlines() if u.strip()]
    local_sitemap = out_dir / "sitemap.xml"
    merge_and_write_sitemap(
        site_url=cfg.site_url,
        new_urls=urls,
        existing_path=Path(args.existing) if args.existing else None,
        output_path=local_sitemap,
    )
    print(f"[ok] sitemap written → {local_sitemap} ({len(urls)} new urls merged)")

    if args.upload:
        upload_directory(
            local_dir=out_dir,
            remote_dir=cfg.ftp_sitemap_dir,
            host=cfg.ftp_host,
            user=cfg.ftp_user,
            password=cfg.ftp_password,
            port=cfg.ftp_port,
            passive=cfg.ftp_passive,
            pattern="sitemap.xml",
        )
        print(f"[ok] sitemap uploaded to {cfg.ftp_sitemap_dir}")
    return 0


def cmd_indexnow(args: argparse.Namespace) -> int:
    cfg = load_config()
    out_dir = Path(args.out or cfg.output_dir)
    urls_file = Path(args.urls or (out_dir / "urls.txt"))
    urls = [u.strip() for u in urls_file.read_text(encoding="utf-8").splitlines() if u.strip()]
    result = submit_indexnow(
        host=cfg.indexnow_host,
        key=cfg.indexnow_key,
        key_location=cfg.indexnow_key_location,
        url_list=urls,
        endpoint=cfg.indexnow_endpoint,
        chunk_size=args.chunk,
    )
    print(f"[ok] IndexNow submitted: {result}")
    return 0


def cmd_all(args: argparse.Namespace) -> int:
    rc = cmd_generate(args)
    if rc != 0:
        return rc
    rc = cmd_upload(args)
    if rc != 0:
        return rc
    # force sitemap upload in all mode
    args.upload = True
    rc = cmd_sitemap(args)
    if rc != 0:
        return rc
    return cmd_indexnow(args)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Cafe24 SEO bulk publisher")
    p.add_argument("--env", default=str(ROOT / ".env"), help="env file path")
    sub = p.add_subparsers(dest="command", required=True)

    g = sub.add_parser("generate", help="Generate HTML files from keywords")
    g.add_argument("--keywords", required=True, help="keyword list txt (1 per line)")
    g.add_argument("--count", type=int, default=1000, help="max pages to generate")
    g.add_argument("--out", default=None, help="output directory")
    g.add_argument("--template", default=None, help="HTML template path")
    g.set_defaults(func=cmd_generate)

    u = sub.add_parser("upload", help="FTP upload generated HTML")
    u.add_argument("--out", default=None, help="local directory")
    u.add_argument("--pattern", default="*.html", help="glob pattern")
    u.set_defaults(func=cmd_upload)

    s = sub.add_parser("sitemap", help="Build/merge sitemap.xml")
    s.add_argument("--out", default=None)
    s.add_argument("--urls", default=None, help="urls.txt path")
    s.add_argument("--existing", default=None, help="existing sitemap.xml to merge")
    s.add_argument("--upload", action="store_true", help="also FTP upload sitemap.xml")
    s.set_defaults(func=cmd_sitemap)

    i = sub.add_parser("indexnow", help="Submit URLs to IndexNow (Naver)")
    i.add_argument("--out", default=None)
    i.add_argument("--urls", default=None)
    i.add_argument("--chunk", type=int, default=10000, help="urls per request")
    i.set_defaults(func=cmd_indexnow)

    a = sub.add_parser("all", help="generate → upload → sitemap → indexnow")
    a.add_argument("--keywords", required=True)
    a.add_argument("--count", type=int, default=1000)
    a.add_argument("--out", default=None)
    a.add_argument("--template", default=None)
    a.add_argument("--pattern", default="*.html")
    a.add_argument("--urls", default=None)
    a.add_argument("--existing", default=None)
    a.add_argument("--chunk", type=int, default=10000)
    a.set_defaults(func=cmd_all)

    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    env_path = Path(args.env)
    if env_path.exists():
        load_dotenv(env_path)
    else:
        load_dotenv(ROOT / ".env")
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
