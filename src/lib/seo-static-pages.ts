import fs from "fs/promises";
import path from "path";
import type { SeoPage } from "@/lib/data";

const ROOT = path.join(process.cwd(), "data", "seo-static");

function hostDir(hostname: string): string {
  const host = hostname.trim().toLowerCase().replace(/^www\./, "");
  return path.join(ROOT, host);
}

export async function readStaticSeoPage(
  hostname: string,
  key: string
): Promise<SeoPage | undefined> {
  const dir = hostDir(hostname);
  const direct = path.join(dir, "pages", `${key}.json`);
  try {
    const raw = await fs.readFile(direct, "utf-8");
    return JSON.parse(raw) as SeoPage;
  } catch {
    /* continue */
  }

  try {
    const indexRaw = await fs.readFile(path.join(dir, "index.json"), "utf-8");
    const index = JSON.parse(indexRaw) as { slugs?: string[] };
    for (const slug of index.slugs || []) {
      if (slug === key) continue;
      try {
        const raw = await fs.readFile(path.join(dir, "pages", `${slug}.json`), "utf-8");
        const page = JSON.parse(raw) as SeoPage;
        if (page.id === key || page.slug === key) return page;
      } catch {
        /* skip */
      }
    }
  } catch {
    /* no index */
  }
  return undefined;
}

export async function listStaticSeoPages(hostname: string): Promise<SeoPage[]> {
  const dir = path.join(hostDir(hostname), "pages");
  try {
    const files = await fs.readdir(dir);
    const pages: SeoPage[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(dir, file), "utf-8");
        pages.push(JSON.parse(raw) as SeoPage);
      } catch {
        /* skip */
      }
    }
    return pages.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}
