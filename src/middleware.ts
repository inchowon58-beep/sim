import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminPath } from "@/lib/admin-path";
import { isRegisteredKeywordPath } from "@/lib/keyword-slugs";

const SKIP_PREFIXES = ["/api", "/_next", "/assets"];

function shouldSkipProxy(pathname: string): boolean {
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (isAdminPath(pathname)) return true;
  if (/\.(txt|xml|ico|svg|png|jpg|jpeg|webp|gif)$/i.test(pathname)) {
    return true;
  }
  return false;
}

/** rewrite missing/has 조건은 요청 헤더 기준 — response 헤더가 아님 */
function nextWithSkipProxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-seo-subpage", "true");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

/**
 * 라우팅 분기
 * - /admin, /api → Next.js 앱
 * - 등록 키워드 슬러그 → SEO 서브페이지 (route handler)
 * - 그 외 /, /pets … → agapetstory 프록시 (next.config rewrite)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipProxy(pathname) || isRegisteredKeywordPath(pathname)) {
    return nextWithSkipProxy(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
