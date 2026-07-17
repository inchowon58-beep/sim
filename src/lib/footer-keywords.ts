import { guidePageUrl } from "@/lib/constants";
import { resolvePagesContext } from "@/lib/pages-resolver";
import { normalizeSeoKeyword } from "@/lib/seo-keyword";
import { INQUIRY_SECTION_ID } from "@/lib/exposure-mode";

/** 푸터 하단 키워드 텍스트 → 목록 (줄바꿈·쉼표·세미콜론) */
export function parseFooterKeywords(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];

  const seen = new Set<string>();
  const items: string[] = [];

  for (const part of raw.split(/[\n,;|]+/)) {
    const keyword = part.trim().replace(/\s+/g, " ");
    if (!keyword || keyword.length < 2) continue;
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(keyword);
  }

  return items;
}

export interface FooterKeywordLink {
  label: string;
  href: string;
  /** 실제 SEO 상세페이지 매칭 여부 */
  hasPage: boolean;
}

function normalizeKey(value: string): string {
  return normalizeSeoKeyword(value).replace(/\s/g, "").toLowerCase();
}

/**
 * 하단 키워드 → 실제 SEO 페이지 링크 (있으면), 없으면 상담 문의 앵커.
 */
export async function resolveFooterKeywordLinks(
  raw: string | undefined | null
): Promise<FooterKeywordLink[]> {
  const keywords = parseFooterKeywords(raw);
  if (keywords.length === 0) return [];

  const { pages } = await resolvePagesContext();
  const byExact = new Map<string, { slug: string; keyword: string }>();
  for (const page of pages) {
    byExact.set(normalizeKey(page.keyword), {
      slug: page.slug,
      keyword: page.keyword,
    });
  }

  return keywords.map((label) => {
    const key = normalizeKey(label);
    const exact = byExact.get(key);
    if (exact) {
      return {
        label,
        href: guidePageUrl(exact.slug),
        hasPage: true,
      };
    }

    const partial = pages.find((p) => {
      const pk = normalizeKey(p.keyword);
      return pk.includes(key) || key.includes(pk);
    });
    if (partial) {
      return {
        label,
        href: guidePageUrl(partial.slug),
        hasPage: true,
      };
    }

    return {
      label,
      href: `/#${INQUIRY_SECTION_ID}`,
      hasPage: false,
    };
  });
}
