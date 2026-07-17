import type { Metadata } from "next";
import type { SiteConfig } from "./site-config-types";
import { pickSeoSuffixKeywords } from "./seo-title-keywords";
import { NAVER_SITE_VERIFICATION } from "./constants";
import { getSiteUrl } from "./site-url";
import { resolveGeoMeta } from "./geo-meta";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export function getOgImageAbsoluteUrl(
  config: SiteConfig,
  ogPath: string
): string {
  const base = getSiteUrl(config).replace(/\/$/, "");
  const path = ogPath.startsWith("/") ? ogPath : `/${ogPath}`;
  return `${base}${path}`;
}

export function buildOgImageMeta(
  config: SiteConfig,
  ogPath: string,
  alt: string
) {
  const url = getOgImageAbsoluteUrl(config, ogPath);
  return [
    {
      url,
      secureUrl: url,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt,
      type: "image/png" as const,
    },
  ];
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogPath?: string;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
  /** geo 메타용 지역 힌트 (예: 인천) */
  geoRegion?: string | null;
}

export function buildPageMetadata(
  config: SiteConfig,
  options: PageMetadataOptions
): Metadata {
  const {
    title,
    description,
    path = "/",
    ogPath,
    type = "website",
    keywords,
    noIndex = false,
    geoRegion,
  } = options;

  const url = path.startsWith("http") ? path : `${getSiteUrl(config)}${path}`;
  const images = ogPath
    ? buildOgImageMeta(config, ogPath, title)
    : buildOgImageMeta(config, "/opengraph-image", title);
  const geo = resolveGeoMeta(geoRegion);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: config.brandName,
      locale: "ko_KR",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
    other: {
      "og:image:width": String(OG_IMAGE_WIDTH),
      "og:image:height": String(OG_IMAGE_HEIGHT),
      ...geo,
    },
  };
}

export function buildSiteMetadata(
  config: SiteConfig,
  options?: { geoRegion?: string | null }
): Metadata {
  const images = buildOgImageMeta(config, "/opengraph-image", config.brandName);
  const baseUrl = getSiteUrl(config);
  const suffixKeywords = pickSeoSuffixKeywords(config.brandName, 3);
  const defaultTitle = `${config.brandName} | 강아지·고양이 파양·무료분양 · ${suffixKeywords.join("·")}`;
  const geo = resolveGeoMeta(options?.geoRegion);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${config.brandName}`,
    },
    description: config.description,
    keywords: [
      config.brandName,
      "강아지파양",
      "고양이파양",
      "강아지무료분양",
      "고양이무료분양",
      "강아지보호소",
      "고양이보호소",
      ...suffixKeywords,
    ],
    alternates: {
      canonical: baseUrl,
      types: {
        "application/rss+xml": [
          { url: "/feed.xml", title: `${config.brandName} RSS` },
          { url: "/rss.xml", title: `${config.brandName} RSS` },
        ],
      },
    },
    robots: { index: true, follow: true },
    verification: {
      other: {
        "naver-site-verification": NAVER_SITE_VERIFICATION,
      },
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
    },
    openGraph: {
      title: config.brandName,
      description: config.description,
      url: baseUrl,
      siteName: config.brandName,
      locale: "ko_KR",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: config.brandName,
      description: config.description,
      images: images.map((img) => img.url),
    },
    other: {
      "og:image:width": String(OG_IMAGE_WIDTH),
      "og:image:height": String(OG_IMAGE_HEIGHT),
      ...geo,
    },
  };
}
