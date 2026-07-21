import fs from "fs/promises";
import { headers } from "next/headers";
import path from "path";
import { normalizePageKey, type SeoPage } from "@/lib/data";

/** Vercel CDN에 배포되는 경로 (public/seo-data) */
const PUBLIC_ROOT = path.join(process.cwd(), "public", "seo-data");

function normalizeHost(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/^www\./, "");
}

async function requestBaseUrl(): Promise<string> {
  try {
    const h = await headers();
    const raw =
      h.get("x-forwarded-host")?.split(",")[0]?.trim() ||
      h.get("host")?.trim();
    if (raw) {
      const proto = h.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
      return `${proto}://${raw.replace(/^www\./, "")}`.replace(/\/$/, "");
    }
  } catch {
    /* outside request */
  }
  const { getSiteUrlAsync } = await import("@/lib/site-url");
  return getSiteUrlAsync();
}

async function readJsonFile<T>(filePath: string): Promise<T | undefined> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

async function fetchJson<T>(url: string): Promise<T | undefined> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return undefined;
    return (await res.json()) as T;
  } catch {
    return undefined;
  }
}

function publicPagePath(host: string, slug: string): string {
  return `/seo-data/${host}/pages/${encodeURIComponent(slug)}.json`;
}

export async function readStaticSeoPage(
  hostname: string,
  key: string
): Promise<SeoPage | undefined> {
  const host = normalizeHost(hostname);
  const slug = normalizePageKey(key);
  const dir = path.join(PUBLIC_ROOT, host, "pages");

  const direct = await readJsonFile<SeoPage>(path.join(dir, `${slug}.json`));
  if (direct) return direct;

  const base = await requestBaseUrl();
  const fromUrl = await fetchJson<SeoPage>(`${base}${publicPagePath(host, slug)}`);
  if (fromUrl) return fromUrl;

  const index =
    (await readJsonFile<{ slugs?: string[] }>(path.join(PUBLIC_ROOT, host, "index.json"))) ||
    (await fetchJson<{ slugs?: string[] }>(`${base}/seo-data/${host}/index.json`));

  for (const indexedSlug of index?.slugs || []) {
    if (indexedSlug === slug) continue;
    let page = await readJsonFile<SeoPage>(path.join(dir, `${indexedSlug}.json`));
    if (!page) {
      page = await fetchJson<SeoPage>(`${base}${publicPagePath(host, indexedSlug)}`);
    }
    if (page && (page.id === slug || page.slug === slug)) return page;
  }
  return undefined;
}

export async function listStaticSeoPages(hostname: string): Promise<SeoPage[]> {
  const host = normalizeHost(hostname);
  const dir = path.join(PUBLIC_ROOT, host, "pages");
  const pages: SeoPage[] = [];

  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const page = await readJsonFile<SeoPage>(path.join(dir, file));
      if (page) pages.push(page);
    }
  } catch {
    /* local dir 없음 */
  }

  if (pages.length === 0) {
    const base = await requestBaseUrl();
    const index = await fetchJson<{ slugs?: string[] }>(
      `${base}/seo-data/${host}/index.json`
    );
    for (const slug of index?.slugs || []) {
      const page = await fetchJson<SeoPage>(`${base}${publicPagePath(host, slug)}`);
      if (page) pages.push(page);
    }
  }

  return pages.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
