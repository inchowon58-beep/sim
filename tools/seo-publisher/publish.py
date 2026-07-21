"""SEO 대량 발행 CLI — 도메인별 JSON → Vercel(git push) → IndexNow

  python publish.py run --hostname example.com --keywords keywords.txt
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


def main() -> int:
    parser = argparse.ArgumentParser(description="Vercel multi-domain SEO publisher")
    parser.add_argument("--env", default=str(ROOT / ".env"))
    sub = parser.add_subparsers(dest="command", required=True)

    run = sub.add_parser("run", help="generate + sitemap + deploy + indexnow")
    run.add_argument("--hostname", default=None, help="sites.json의 hostname")
    run.add_argument("--keywords", required=True, help="키워드 txt")
    run.add_argument("--count", type=int, default=None)
    run.add_argument("--no-deploy", action="store_true")
    run.add_argument("--no-indexnow", action="store_true")
    run.add_argument("--no-push", action="store_true", help="commit만 (push 안 함)")

    gen = sub.add_parser("generate", help="JSON + sitemap만 생성")
    gen.add_argument("--hostname", default=None)
    gen.add_argument("--keywords", required=True)
    gen.add_argument("--count", type=int, default=None)

    list_cmd = sub.add_parser("sites", help="sites.json 목록")

    args = parser.parse_args()
    load_dotenv(Path(args.env) if Path(args.env).exists() else ROOT / ".env")
    cfg = load_config()

    if args.command == "sites":
        for s in cfg.sites:
            print(f"{s.hostname}\t{s.brand_name}\tdesign={s.site_design}\t{s.site_url}")
        return 0

    if args.command == "generate":
        result = run_pipeline(
            cfg=cfg,
            hostname=args.hostname,
            keywords_file=Path(args.keywords),
            count=args.count,
            do_deploy=False,
            do_indexnow=False,
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
        )

    print(f"[ok] host: {result['hostname']} design={result.get('site_design')}")
    print(f"[ok] generated: {result['generated']}")
    print(f"[ok] pages_dir: {result['pages_dir']}")
    print(f"[ok] sitemap: {result['sitemap_path']} (urls={result['sitemap_total']})")
    if result.get("urls"):
        print(f"[ok] sample: {result['urls'][0]}")
    if result.get("deploy_log"):
        print("[deploy]")
        print(result["deploy_log"])
    if result.get("indexnow"):
        print(f"[indexnow] {result['indexnow']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
