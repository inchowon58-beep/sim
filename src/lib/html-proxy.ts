import type { SeoMeta } from "@/types/keyword";

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function resolveAbsoluteUrl(url: string, pageOrigin: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = pageOrigin.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function buildSeoHeadBlock(seo: SeoMeta, pageOrigin: string): string {
  const ogImage = seo.ogImage
    ? resolveAbsoluteUrl(seo.ogImage, pageOrigin)
    : undefined;

  const lines = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.ogUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(seo.ogSiteName)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />`,
  ];

  if (ogImage) {
    lines.push(
      `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`
    );
  } else {
    lines.push(`<meta name="twitter:card" content="summary" />`);
  }

  if (seo.keywords?.length) {
    lines.push(
      `<meta name="keywords" content="${escapeHtml(seo.keywords.join(", "))}" />`
    );
  }

  return lines.join("\n");
}

/** 원본 HTML에서 SEO 관련 태그 제거 (치환 충돌 방지) */
function stripSeoTags(html: string): string {
  return html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']keywords["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:[^"']+["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']twitter:[^"']+["'][^>]*>/gi, "")
    .replace(/<base[^>]*>/gi, "");
}

/**
 * 아가펫스토리 HTML을 서버에서 fetch 후 키워드 SEO head 주입
 * - <base href> 로 CSS/JS/이미지 상대경로를 원본 사이트 기준으로 로드
 * - 본문은 원본 HTML 그대로 (iframe 없음)
 */
export async function fetchProxiedPage(
  seo: SeoMeta,
  targetPath = "/"
): Promise<string> {
  const base = PROXY_TARGET.replace(/\/$/, "");
  const targetUrl = `${base}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`;
  const origin = new URL(base).origin;

  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Upstream ${response.status}: ${targetUrl}`);
  }

  let html = await response.text();
  html = stripSeoTags(html);

  const seoBlock = buildSeoHeadBlock(seo, origin);
  const baseTag = `<base href="${origin}/">`;
  const marker = "<!-- agapet-seo-proxy -->";

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>${marker}\n${baseTag}\n${seoBlock}`
    );
  } else if (/<html[^>]*>/i.test(html)) {
    html = html.replace(
      /<html([^>]*)>/i,
      `<html$1><head>${marker}${baseTag}${seoBlock}</head>`
    );
  } else {
    html = `<!DOCTYPE html><html><head>${marker}${baseTag}${seoBlock}</head><body>${html}</body></html>`;
  }

  return html;
}

export function getProxyTarget(): string {
  return PROXY_TARGET;
}
