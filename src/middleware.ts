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

/**
 * 라우팅 분기
 * - /admin, /api → Next.js 앱
 * - 등록 키워드 슬러그 → SEO 서브페이지 (route handler)
 * - 그 외 /, /pets … → agapetstory 프록시 (next.config rewrite)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipProxy(pathname) || isRegisteredKeywordPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-seo-subpage", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
