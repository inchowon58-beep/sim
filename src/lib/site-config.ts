import { getSettings, type SeoFaq, type SeoPage } from "./data";
import {
  DEFAULT_SITE_CONFIG,
  phoneToTel,
  toPublicConfig,
  type PublicSiteConfig,
  type SiteConfig,
} from "./site-config-types";
import {
  DEFAULT_EXPOSURE_MODE,
  resolveExposureMode,
  type ExposureMode,
} from "./exposure-mode";
import { getImageIndexFromSeed, getImageUrl } from "./site-images";
import { enrichSeoContentWithImages } from "./seo-content-images";
import {
  buildSeoPageTitle,
  normalizeSeoKeyword,
  polishSeoHtmlContent,
  polishSeoText,
  extractRegionForKeyword,
} from "./seo-keyword";

export type { SiteConfig, PublicSiteConfig, ExposureMode };
export { DEFAULT_SITE_CONFIG, phoneToTel, toPublicConfig, DEFAULT_EXPOSURE_MODE };

/** 과거 저장 콘텐츠 치환용 (설정 변경 시 자동 반영) */
const LEGACY_BRANDS = ["123철거", "1977철거", "아가펫보호소"];
const LEGACY_PHONES = ["1555-7321", "15557321"];
const LEGACY_COMPANIES = ["주식회사베룸", "주식회사 베룸"];

export async function getLegacySiteConfig(): Promise<SiteConfig> {
  const stored = await getSettings();
  const merged = { ...DEFAULT_SITE_CONFIG, ...stored };
  return {
    ...merged,
    exposureMode: resolveExposureMode(merged.exposureMode),
  };
}

/** hostname 테넌트 설정 반영 (공개 페이지·컴포넌트용) */
export async function getSiteConfig(): Promise<SiteConfig> {
  const { getResolvedSiteConfig } = await import("@/utils/siteConfig");
  const { config } = await getResolvedSiteConfig();
  return config;
}

export function getPageImageUrl(page: SeoPage, config: SiteConfig): string {
  // 발행기·수동 지정 절대 URL 우선 (커스텀 이미지)
  if (page.imageUrl?.startsWith("http://") || page.imageUrl?.startsWith("https://")) {
    return page.imageUrl;
  }
  if (page.imageIndex) {
    return getImageUrl(page.imageIndex, config);
  }
  return getImageUrl(getImageIndexFromSeed(page.slug || page.keyword, config), config);
}

const TOKEN_KEYS: (keyof SiteConfig)[] = [
  "brandName",
  "companyName",
  "tagline",
  "description",
  "phone",
  "email",
  "address",
  "businessNumber",
  "representative",
  "supportBase",
  "supportExtra",
  "supportMax",
  "url",
];

export function applySiteTokens(text: string, config: SiteConfig): string {
  if (!text) return text;

  let result = text;
  for (const key of TOKEN_KEYS) {
    const token = `{{${key}}}`;
    result = result.split(token).join(String(config[key]));
  }

  for (const legacy of LEGACY_BRANDS) {
    if (legacy !== config.brandName) {
      result = result.split(legacy).join(config.brandName);
    }
  }
  for (const legacy of LEGACY_PHONES) {
    if (legacy !== config.phone && legacy !== phoneToTel(config.phone)) {
      result = result.split(legacy).join(config.phone);
    }
  }
  for (const legacy of LEGACY_COMPANIES) {
    if (legacy !== config.companyName) {
      result = result.split(legacy).join(config.companyName);
    }
  }

  return result;
}

export interface ResolvedSeoPage extends Omit<SeoPage, "imageUrl" | "imageIndex"> {
  imageUrl: string;
  title: string;
  description: string;
  content: string;
  faqs: SeoFaq[];
}

export function resolveSeoPage(page: SeoPage, config: SiteConfig): ResolvedSeoPage {
  const seed = page.slug || page.keyword;
  const keyword = normalizeSeoKeyword(page.keyword);
  const region = extractRegionForKeyword(keyword) || page.regionName || null;
  const tokenized = applySiteTokens(page.content, config);
  const polishedContent = polishSeoHtmlContent(tokenized, keyword);

  return {
    ...page,
    keyword,
    title: buildSeoPageTitle(applySiteTokens(page.title, config), keyword, config.brandName),
    description: polishSeoText(applySiteTokens(page.description, config), region),
    content: enrichSeoContentWithImages(polishedContent, keyword, config, seed),
    faqs: (page.faqs || []).map((f) => ({
      question: polishSeoText(applySiteTokens(f.question, config), region),
      answer: polishSeoText(applySiteTokens(f.answer, config), region),
    })),
    imageUrl: getPageImageUrl(page, config),
  };
}
