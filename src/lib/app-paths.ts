/** agapetstory 단일 경로 (SEO 서브페이지 아님) */
export const AGAPET_SINGLE_SEGMENTS = new Set(["pets"]);

/** Next.js 앱이 처리하는 고정 경로 (키워드 슬러그·프록시 제외) */
export const APP_STATIC_PATHS = new Set([
  "api",
  "admin",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "rss.xml",
]);

export function isAppStaticPath(pathname: string): boolean {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return false;

  const segments = clean.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  return APP_STATIC_PATHS.has(decodeURIComponent(segments[0]).toLowerCase());
}
