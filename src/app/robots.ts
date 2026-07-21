import type { MetadataRoute } from "next";
import { getSiteUrlAsync } from "@/lib/site-url";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const [{ hostname }, baseUrl] = await Promise.all([
    getResolvedSiteConfig(),
    getSiteUrlAsync(),
  ]);
  const host = (hostname || "").toLowerCase().replace(/^www\./, "");
  const sitemaps = [`${baseUrl}/sitemap.xml`, `${baseUrl}/seo-guides-sitemap.xml`];
  if (host) {
    sitemaps.splice(1, 0, `${baseUrl}/seo-hosts/${host}/sitemap.xml`);
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin/master", "/api/"] },
    sitemap: sitemaps,
  };
}
