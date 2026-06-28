import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminPath } from "@/lib/admin-path";
import { isRegisteredKeywordPath } from "@/lib/keyword-slugs";

/** SEO 서브페이지용 public 이미지 */
const OUR_ASSET_PREFIX = "/assets/images/";

/** IndexNow 키 검증 파일 (루트 .txt) */
const INDEXNOW_KEY_PATTERN = /^\/[a-f0-9]{32}\.txt$/i;

/**
 * agapetstory 프록시(rewrite)를 건너뛰고 우리 Next.js 앱이 처리할 경로
 * - /admin, /api, 키워드 서브페이지, 우리 public 파일
 * - /admin·서브페이지에서 로드하는 /_next/* 정적 에셋
 */
function shouldBypassAgapetProxy(
  pathname: string,
  request: NextRequest
): boolean {
  if (pathname.startsWith("/api")) return true;
  if (isAdminPath(pathname)) return true;
  if (isRegisteredKeywordPath(pathname)) return true;
  if (pathname.startsWith(OUR_ASSET_PREFIX)) return true;
  if (INDEXNOW_KEY_PATTERN.test(pathname)) return true;

  if (pathname.startsWith("/_next/")) {
    const referer = request.headers.get("referer");
    if (!referer) return false;

    try {
      const refPath = new URL(referer).pathname;
      if (isAdminPath(refPath)) return true;
      if (isRegisteredKeywordPath(refPath)) return true;
    } catch {
      return false;
    }
  }

  return false;
}

/** rewrite missing 조건: x-seo-subpage 헤더가 없을 때만 agapetstory 로 프록시 */
function nextWithAppRouting(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-seo-subpage", "true");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldBypassAgapetProxy(pathname, request)) {
    return nextWithAppRouting(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?:.*))"],
};
