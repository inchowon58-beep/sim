from __future__ import annotations

from pathlib import Path

from publisher.config import Config, find_site
from publisher.deploy import deploy_to_vercel_git
from publisher.generate import generate_pages_for_site, parse_keywords, read_keywords_file
from publisher.indexnow import submit_indexnow
from publisher.sitemap import merge_and_write_sitemap


def run_pipeline(
    *,
    cfg: Config,
    hostname: str | None = None,
    keyword_text: str | None = None,
    keywords_file: Path | None = None,
    count: int | None = None,
    do_deploy: bool = True,
    do_indexnow: bool = True,
    push: bool | None = None,
) -> dict:
    site = find_site(cfg, hostname)

    if keywords_file:
        keywords = read_keywords_file(keywords_file, count)
    else:
        keywords = parse_keywords(keyword_text or "", count)

    urls = generate_pages_for_site(
        site=site,
        keywords=keywords,
        repo_root=cfg.repo_root,
    )

    host_dir = cfg.seo_static_root / site.hostname
    urls_manifest = host_dir / "_urls.txt"
    prev: list[str] = []
    if urls_manifest.exists():
        prev = [
            u.strip()
            for u in urls_manifest.read_text(encoding="utf-8").splitlines()
            if u.strip()
        ]
    all_urls = list(dict.fromkeys([*prev, *urls]))
    urls_manifest.parent.mkdir(parents=True, exist_ok=True)
    urls_manifest.write_text("\n".join(all_urls) + "\n", encoding="utf-8")

    sitemap_path = cfg.sitemap_root / site.hostname / "sitemap.xml"
    total = merge_and_write_sitemap(
        site_url=site.site_url,
        new_urls=urls,
        existing_path=sitemap_path,
        output_path=sitemap_path,
    )

    # 레거시 단일 sitemap도 동일 URL로 갱신 (robots 폴백)
    legacy_sitemap = cfg.repo_root / "public" / "seo-guides-sitemap.xml"
    merge_and_write_sitemap(
        site_url=site.site_url,
        new_urls=all_urls,
        existing_path=legacy_sitemap if legacy_sitemap.exists() else None,
        output_path=legacy_sitemap,
    )

    key_file = None
    if cfg.indexnow_key:
        key_file = cfg.repo_root / "public" / f"{cfg.indexnow_key}.txt"
        if not key_file.exists():
            key_file.write_text(cfg.indexnow_key + "\n", encoding="utf-8")

    deploy_log = ""
    if do_deploy:
        should_push = cfg.auto_push if push is None else push
        paths = [
            host_dir,
            cfg.sitemap_root / site.hostname,
            legacy_sitemap,
        ]
        if key_file and key_file.exists():
            paths.append(key_file)
        deploy_log = deploy_to_vercel_git(
            repo_root=cfg.repo_root,
            paths=paths,
            message=f"Publish {len(urls)} SEO pages for {site.hostname}.",
            remote=cfg.git_remote,
            branch_main=cfg.git_branch_main,
            branch_production=cfg.git_branch_production,
            push=should_push,
        )

    indexnow_result = None
    if do_indexnow and cfg.indexnow_key:
        key_location = f"{site.site_url.rstrip('/')}/{cfg.indexnow_key}.txt"
        indexnow_result = submit_indexnow(
            host=site.hostname,
            key=cfg.indexnow_key,
            key_location=key_location,
            url_list=urls,
            endpoint=cfg.indexnow_endpoint,
        )
    elif do_indexnow and not cfg.indexnow_key:
        indexnow_result = {"skipped": True, "reason": "INDEXNOW_KEY 없음 (.env)"}

    return {
        "generated": len(urls),
        "urls": urls,
        "hostname": site.hostname,
        "site_url": site.site_url,
        "brand_name": site.brand_name,
        "site_design": site.site_design,
        "sitemap_total": total,
        "deploy_log": deploy_log,
        "indexnow": indexnow_result,
        "pages_dir": str(host_dir / "pages"),
        "sitemap_path": str(sitemap_path),
    }
