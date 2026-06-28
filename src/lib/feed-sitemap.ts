import type { KeywordEntry } from "@/types/keyword";
import { getAllKeywords } from "./keywords";
import { getSiteSettings } from "./site-settings";
import { resolveCanonicalBase } from "./seo";
import { escapeXml, toRfc822Date } from "./xml-utils";

export function buildSitemapXml(
  keywords: KeywordEntry[],
  canonicalBase: string
): string {
  const base = canonicalBase.replace(/\/$/, "");
  const urls: string[] = [
    `  <url>
    <loc>${escapeXml(`${base}/`)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  for (const entry of keywords) {
    const loc = `${base}/${encodeURIComponent(entry.slug)}`;
    urls.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(entry.updatedAt.slice(0, 10))}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function buildRssXml(
  keywords: KeywordEntry[],
  options: {
    canonicalBase: string;
    channelTitle: string;
    channelDescription: string;
    maxItems?: number;
  }
): string {
  const base = options.canonicalBase.replace(/\/$/, "");
  const maxItems = options.maxItems ?? 100;
  const items = [...keywords]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, maxItems);

  const itemXml = items
    .map((entry) => {
      const link = `${base}/${encodeURIComponent(entry.slug)}`;
      return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(entry.description)}</description>
      <pubDate>${escapeXml(toRfc822Date(entry.createdAt))}</pubDate>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(options.channelTitle)}</title>
    <link>${escapeXml(`${base}/`)}</link>
    <description>${escapeXml(options.channelDescription)}</description>
    <language>ko</language>
    <lastBuildDate>${escapeXml(toRfc822Date(new Date().toISOString()))}</lastBuildDate>
${itemXml}
  </channel>
</rss>`;
}

export function buildRobotsTxt(canonicalBase: string): string {
  const base = canonicalBase.replace(/\/$/, "");
  return `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
}

export function resolveRequestCanonicalBase(request: Request): string {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  return resolveCanonicalBase(host, protocol);
}

const XML_CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

export async function buildSitemapResponse(request: Request): Promise<Response> {
  const keywords = await getAllKeywords();
  const canonicalBase = resolveRequestCanonicalBase(request);
  const xml = buildSitemapXml(keywords, canonicalBase);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      ...XML_CACHE_HEADERS,
    },
  });
}

export async function buildRssResponse(request: Request): Promise<Response> {
  const [keywords, settings] = await Promise.all([
    getAllKeywords(),
    getSiteSettings(),
  ]);
  const canonicalBase = resolveRequestCanonicalBase(request);
  const xml = buildRssXml(keywords, {
    canonicalBase,
    channelTitle: `${settings.brandName} SEO 서브페이지`,
    channelDescription: `${settings.brandName} 키워드 서브페이지 최신 목록`,
  });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      ...XML_CACHE_HEADERS,
    },
  });
}

export async function buildRobotsResponse(request: Request): Promise<Response> {
  const canonicalBase = resolveRequestCanonicalBase(request);
  const text = buildRobotsTxt(canonicalBase);

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...XML_CACHE_HEADERS,
    },
  });
}
