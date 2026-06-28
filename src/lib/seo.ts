import type { Metadata } from "next";
import type { KeywordEntry, SeoMeta } from "@/types/keyword";

const DEFAULT_SITE_NAME = process.env.SITE_NAME ?? "Agapet Story SEO";
const DEFAULT_CANONICAL_BASE =
  process.env.CANONICAL_BASE_URL ?? "https://sub.mydomain.com";

/** 요청 Host 헤더 기반 동적 Canonical Base (Nginx X-Forwarded-Host 지원) */
export function resolveCanonicalBase(
  host?: string | null,
  protocol?: string | null
): string {
  if (host) {
    const proto = protocol ?? "https";
    return `${proto}://${host}`;
  }
  return DEFAULT_CANONICAL_BASE.replace(/\/$/, "");
}

/** 키워드 엔트리 → SEO 메타 객체 */
export function buildSeoMeta(
  entry: KeywordEntry,
  canonicalBase: string,
  imageOverride?: string | null
): SeoMeta {
  const base = canonicalBase.replace(/\/$/, "");
  const canonical = `${base}/${encodeURIComponent(entry.slug)}`;
  const ogImage = imageOverride ?? entry.ogImage ?? entry.mixedImageUrl;

  return {
    title: entry.title,
    description: entry.description,
    canonical,
    ogTitle: entry.title,
    ogDescription: entry.description,
    ogUrl: canonical,
    ogImage,
    ogSiteName: DEFAULT_SITE_NAME,
    keywords: entry.tags,
  };
}

/** Next.js App Router Metadata API 변환 */
export function seoMetaToNextMetadata(meta: SeoMeta): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: meta.canonical,
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.ogUrl,
      siteName: meta.ogSiteName,
      type: "website",
      ...(meta.ogImage ? { images: [{ url: meta.ogImage }] } : {}),
    },
    twitter: {
      card: meta.ogImage ? "summary_large_image" : "summary",
      title: meta.ogTitle,
      description: meta.ogDescription,
      ...(meta.ogImage ? { images: [meta.ogImage] } : {}),
    },
  };
}
