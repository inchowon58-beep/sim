/** agapetstory 가 사용하는 단일 경로 (SEO 서브페이지 아님) */
const AGAPET_SINGLE_SEGMENTS = new Set(["pets"]);

const APP_RESERVED_SEGMENTS = new Set([
  "api",
  "admin",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

/**
 * SEO 서브페이지 후보 경로 (한글 단일 세그먼트)
 * 빌드 시점 keywords.json 에 없어도 미들웨어에서 앱 라우트로 보냄
 */
export function isPotentialKeywordSubpagePath(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return false;

  const segments = clean.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const segment = decodeURIComponent(segments[0]);
  const lower = segment.toLowerCase();

  if (APP_RESERVED_SEGMENTS.has(lower)) return false;
  if (AGAPET_SINGLE_SEGMENTS.has(lower)) return false;
  if (lower.startsWith("_next")) return false;

  return /[\uAC00-\uD7A3]/.test(segment);
}

/** @deprecated isPotentialKeywordSubpagePath 사용 */
export function isRegisteredKeywordPath(pathname: string): boolean {
  return isPotentialKeywordSubpagePath(pathname);
}
