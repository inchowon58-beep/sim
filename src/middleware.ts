import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminPath } from "@/lib/admin-path";
import { isRegisteredKeywordPath } from "@/lib/keyword-slugs";

/** Next.js 정적 에셋 — agapetstory 프록시에서 반드시 제외 */
const APP_ASSET_PREFIXES = ["/_next/static", "/_next/image"];

const SKIP_PREFIXES = ["/api", "/_next", "/assets"];

function shouldSkipProxy(pathname: string): boolean {
  if (APP_ASSET_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (isAdminPath(pathname)) return true;
  if (/\.(txt|xml|ico|svg|png|jpg|jpeg|webp|gif)$/i.test(pathname)) {
    return true;
  }
  return false;
}

/** rewrite missing/has 조건은 요청 헤더 기준 */
function nextWithSkipProxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-seo-subpage", "true");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipProxy(pathname) || isRegisteredKeywordPath(pathname)) {
    return nextWithSkipProxy(request);
  }

  return NextResponse.next();
}

/**
 * _next/static 을 matcher 에서 빼면 CSS/JS 가 agapetstory 로 프록시되어 404 발생
 */
export const config = {
  matcher: ["/((?:.*))"],
};
