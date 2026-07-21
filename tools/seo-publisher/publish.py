"""SEO 대량 발행 CLI — 도메인별 JSON → Vercel(git push) → IndexNow

  python publish.py run --hostname example.com --keywords keywords.txt \\
    --company "업체명" --image-url "https://cdn.example.com/a.jpg"
  python app_gui.py
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from publisher.config import load_config  # noqa: E402
from publisher.pipeline import run_pipeline  # noqa: E402
from publisher.sync_tenants import sync_sites_json  # noqa: E402


def _add_common(p: argparse.ArgumentParser) -> None:
    p.add_argument("--hostname", default=None, help="sites.json의 hostname")
    p.add_argument("--keywords", required=True, help="키워드 txt")
    p.add_argument("--count", type=int, default=None)
    p.add_argument("--company", default=None, help="업체명")
    p.add_argument("--brand", default=None, help="브랜드명")
    p.add_argument("--phone", default=None)
    p.add_argument("--image-url", default=None, help="페이지 히어로 이미지 절대 URL")
    p.add_argument("--image-cdn", default=None, help="CDN 폴더 (01.webp~)")


def main() -> int:
    parser = argparse.ArgumentParser(description="Vercel multi-domain SEO publisher")
    parser.add_argument("--env", default=str(ROOT / ".env"))
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="generate + sitemap + deploy + indexnow")
    _add_common(run)
    run.add_argument("--no-deploy", action="store_true")
    run.add_argument("--no-indexnow", action="store_true")
    run.add_argument("--no-push", action="store_true", help="commit만 (push 안 함)")

    gen = sub.add_parser("generate", help="JSON + sitemap만 생성")
    _add_common(gen)

    sub.add_parser("sites", help="sites.json 목록")
    sync = sub.add_parser("sync-sites", help="관리자(site_configs) → sites.json 동기화")
    sync.add_argument(
        "--api-base",
        default=None,
        help="예: https://sim-seven-woad.vercel.app (기본: SITE_URL)",
    )

    args = parser.parse_args()
    load_dotenv(Path(args.env) if Path(args.env).exists() else ROOT / ".env")
    # 저장소 .env.local 도 보조 로드 (COLLECTION_WORKER_SECRET 등)
    repo_env = ROOT.parent.parent / ".env.local"
    if repo_env.exists():
        load_dotenv(repo_env, override=False)
    cfg = load_config()

    if args.command == "sites":
        for s in cfg.sites:
            print(
                f"{s.hostname}\t{s.company_name or s.brand_name}\t"
                f"design={s.site_design}\timg={s.image_url or s.image_cdn or '-'}\t{s.site_url}"
            )
        return 0

    if args.command == "sync-sites":
        sites = sync_sites_json(cfg.sites_path, api_base=args.api_base)
        print(f"[ok] synced {len(sites)} sites → {cfg.sites_path}")
        for s in sites:
            print(f"  {s.hostname}\t{s.company_name or s.brand_name}\tdesign={s.site_design}")
        return 0

    overrides = dict(
        brand_name=getattr(args, "brand", None),
        company_name=getattr(args, "company", None),
        phone=getattr(args, "phone", None),
        image_url=getattr(args, "image_url", None),
        image_cdn=getattr(args, "image_cdn", None),
    )

    if args.command == "generate":
        result = run_pipeline(
            cfg=cfg,
            hostname=args.hostname,
            keywords_file=Path(args.keywords),
            count=args.count,
            do_deploy=False,
            do_indexnow=False,
            **overrides,
        )
    else:
        result = run_pipeline(
            cfg=cfg,
            hostname=args.hostname,
            keywords_file=Path(args.keywords),
            count=args.count,
            do_deploy=not args.no_deploy,
            do_indexnow=not args.no_indexnow,
            push=False if args.no_push else None,
            **overrides,
        )

    print(f"[ok] host: {result['hostname']} company={result.get('company_name')}")
    print(f"[ok] generated: {result['generated']}")
    print(f"[ok] image: {result.get('image_info')}")
    print(f"[ok] pages_dir: {result['pages_dir']}")
    print(f"[ok] urls_file: {result.get('last_urls_file')}")
    for u in result.get("urls") or []:
        print(f"  {u}")
    if result.get("deploy_log"):
        print("[deploy]")
        print(result["deploy_log"])
    if result.get("indexnow"):
        print(f"[indexnow] {result['indexnow']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
