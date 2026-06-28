/**
 * 슬러그 파싱 및 중복 키워드 접미사 생성
 *
 * URL 규칙:
 *   - 첫 번째: /[키워드슬러그]
 *   - 중복 시: /[키워드슬러그]01, /[키워드슬러그]02 …
 */

const SUFFIX_PATTERN = /^(.+?)(0[1-9]|[1-9]\d+)$/;

/** 키워드 문자열을 URL 슬러그로 변환 */
export function keywordToSlug(keyword: string): string {
  return keyword
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** 슬러그에서 base 슬러그와 접미사 분리 */
export function parseSlug(slug: string): {
  baseSlug: string;
  suffix: string | null;
} {
  const decoded = decodeURIComponent(slug);
  const match = decoded.match(SUFFIX_PATTERN);

  if (match) {
    return { baseSlug: match[1], suffix: match[2] };
  }

  return { baseSlug: decoded, suffix: null };
}

/** 기존 슬러그 목록을 기준으로 다음 사용 가능한 슬러그 생성 */
export function generateUniqueSlug(
  baseKeyword: string,
  existingSlugs: string[]
): { slug: string; suffix: string | null } {
  const baseSlug = keywordToSlug(baseKeyword);
  const slugSet = new Set(existingSlugs.map((s) => decodeURIComponent(s)));

  if (!slugSet.has(baseSlug)) {
    return { slug: baseSlug, suffix: null };
  }

  for (let i = 1; i <= 999; i++) {
    const suffix = i.toString().padStart(2, "0");
    const candidate = `${baseSlug}${suffix}`;
    if (!slugSet.has(candidate)) {
      return { slug: candidate, suffix };
    }
  }

  throw new Error(`슬러그 생성 한도 초과: ${baseKeyword}`);
}

/** 슬러그가 키워드 서브페이지 패턴인지 판별 (Next.js 예약 경로 제외) */
export function isKeywordSlug(pathname: string): boolean {
  const reserved = [
    "api",
    "admin",
    "_next",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
  ];
  const segment = pathname.replace(/^\//, "").split("/")[0];
  return segment.length > 0 && !reserved.includes(segment);
}
