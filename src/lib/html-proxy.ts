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

function resolveAbsoluteUrl(url: string, baseOrigin: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("//")) return `https:${url}`;
  const base = baseOrigin.replace(/\/$/, "");
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

/** Next.js 클라이언트 스크립트 제거 — 타 도메인 URL에서 hydration 오류 방지 */
function stripScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

/** 상대 경로 → 아가펫스토리 절대 URL (CSS·이미지·링크) */
function rewriteRelativeUrls(html: string, origin: string): string {
  const toAbs = (path: string): string => {
    const trimmed = path.trim();
    if (/^(https?:|\/\/|#|mailto:|tel:|javascript:|data:)/i.test(trimmed)) {
      return trimmed;
    }
    return resolveAbsoluteUrl(trimmed, origin);
  };

  html = html.replace(
    /\s(href|src|poster|action)=(["'])([^"']+)\2/gi,
    (_match, attr: string, quote: string, path: string) =>
      ` ${attr}=${quote}${toAbs(path)}${quote}`
  );

  html = html.replace(
    /\ssrcset=(["'])([^"']+)\1/gi,
    (_match, quote: string, srcset: string) => {
      const rewritten = srcset
        .split(",")
        .map((part) => {
          const pieces = part.trim().split(/\s+/);
          pieces[0] = toAbs(pieces[0]);
          return pieces.join(" ");
        })
        .join(", ");
      return ` srcset=${quote}${rewritten}${quote}`;
    }
  );

  return html;
}

export async function fetchProxiedPage(
  seo: SeoMeta,
  targetPath = "/"
): Promise<string> {
  const base = PROXY_TARGET.replace(/\/$/, "");
  const targetUrl = `${base}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`;
  const origin = new URL(base).origin;
  const pageOrigin = new URL(seo.canonical).origin;

  const response = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstream ${response.status}: ${targetUrl}`);
  }

  let html = await response.text();
  html = stripSeoTags(html);
  html = stripScripts(html);
  html = rewriteRelativeUrls(html, origin);

  const seoBlock = buildSeoHeadBlock(seo, pageOrigin);
  const marker = "<!-- agapet-seo-proxy -->";

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>${marker}\n${seoBlock}`
    );
  } else if (/<html[^>]*>/i.test(html)) {
    html = html.replace(
      /<html([^>]*)>/i,
      `<html$1><head>${marker}${seoBlock}</head>`
    );
  } else {
    html = `<!DOCTYPE html><html lang="ko"><head>${marker}${seoBlock}</head><body>${html}</body></html>`;
  }

  if (!/<meta[^>]+charset/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1><meta charset="utf-8"/>`);
  }

  return html;
}

export function getProxyTarget(): string {
  return PROXY_TARGET;
}
