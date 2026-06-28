import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRegisteredKeywordPath } from "@/lib/keyword-slugs";

const SKIP_PREFIXES = ["/api", "/_next", "/assets"];

function shouldSkipProxy(pathname: string): boolean {
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (/\.(txt|xml|ico|svg|png|jpg|jpeg|webp|gif)$/i.test(pathname)) {
    return true;
  }
  return false;
}

/**
 * SEO 서브페이지 vs 아가펫스토리 프록시 분기
 * - 등록된 키워드 슬러그 → Next.js 앱 처리
 * - 그 외(/) → next.config beforeFiles rewrite로 agapetstory 프록시
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipProxy(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-seo-subpage", "true");
    return response;
  }

  if (isRegisteredKeywordPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("x-seo-subpage", "true");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
