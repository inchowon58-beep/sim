import { getPages, getPageByKey, type SeoPage } from "@/lib/data";
import { getTenantPages, getTenantPageByKey } from "@/lib/supabase/tenant-pages";
import {
  listStaticSeoPages,
  readStaticSeoPage,
} from "@/lib/seo-static-pages";
import { getResolvedSiteConfig } from "@/utils/siteConfig";
import type { TenantSiteConfigRow } from "@/types/tenant";

export interface PagesContext {
  pages: SeoPage[];
  tenant: TenantSiteConfigRow | null;
  isTenant: boolean;
}

function hostnameFromTenant(tenant: TenantSiteConfigRow | null, fallbackUrl?: string): string {
  if (tenant?.subdomain) return tenant.subdomain.toLowerCase().replace(/^www\./, "");
  try {
    if (fallbackUrl) return new URL(fallbackUrl).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }
  return "";
}

function mergePages(primary: SeoPage[], extra: SeoPage[]): SeoPage[] {
  const bySlug = new Map<string, SeoPage>();
  for (const p of extra) bySlug.set(p.slug, p);
  for (const p of primary) bySlug.set(p.slug, p); // primary wins
  return Array.from(bySlug.values()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

function resolveHost(
  hostname: string,
  tenant: TenantSiteConfigRow | null,
  fallbackUrl?: string
): string {
  const fromRequest = hostname.trim().toLowerCase().replace(/^www\./, "");
  if (fromRequest) return fromRequest;
  return hostnameFromTenant(tenant, fallbackUrl);
}

export async function resolvePagesContext(): Promise<PagesContext> {
  const { tenant, isTenant, config, hostname } = await getResolvedSiteConfig();
  const host = resolveHost(hostname, tenant, config.url);

  if (isTenant && tenant) {
    const [dbPages, staticPages] = await Promise.all([
      getTenantPages(tenant.id),
      host ? listStaticSeoPages(host) : Promise.resolve([]),
    ]);
    return { pages: mergePages(dbPages, staticPages), tenant, isTenant: true };
  }

  const [pages, staticPages] = await Promise.all([
    getPages(),
    host ? listStaticSeoPages(host) : Promise.resolve([]),
  ]);
  return { pages: mergePages(pages, staticPages), tenant: null, isTenant: false };
}

export async function resolvePageByKey(key: string): Promise<{
  page: SeoPage | undefined;
  tenant: TenantSiteConfigRow | null;
}> {
  const { tenant, isTenant, config, hostname } = await getResolvedSiteConfig();
  const host = resolveHost(hostname, tenant, config.url);

  if (isTenant && tenant) {
    const page = await getTenantPageByKey(tenant.id, key);
    if (page) return { page, tenant };
    if (host) {
      const staticPage = await readStaticSeoPage(host, key);
      if (staticPage) return { page: staticPage, tenant };
    }
    return { page: undefined, tenant };
  }

  const page = await getPageByKey(key);
  if (page) return { page, tenant: null };
  if (host) {
    const staticPage = await readStaticSeoPage(host, key);
    if (staticPage) return { page: staticPage, tenant: null };
  }
  return { page: undefined, tenant: null };
}
