import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminPath } from "@/lib/admin-path";
import { isPotentialKeywordSubpagePath } from "@/lib/keyword-slugs";

/** SEO 서브페이지용 public 이미지 */
const OUR_ASSET_PREFIX = "/assets/images/";

/** IndexNow 키 검증 파일 (루트 .txt) */
const INDEXNOW_KEY_PATTERN = /^\/[a-f0-9]{32}\.txt$/i;

function isAppNextAsset(pathname: string, request: NextRequest): boolean {
  if (!pathname.startsWith("/_next/")) return false;

  const referer = request.headers.get("referer");
  if (!referer) return false;

  try {
    const refPath = new URL(referer).pathname;
    if (isAdminPath(refPath)) return true;
    if (isPotentialKeywordSubpagePath(refPath)) return true;
  } catch {
    return false;
  }

  return false;
}

/**
 * agapetstory 프록시(rewrite)를 건너뛰고 우리 Next.js 앱이 처리할 경로
 */
function shouldBypassAgapetProxy(
  pathname: string,
  request: NextRequest
): boolean {
  if (pathname.startsWith("/api")) return true;
  if (isAdminPath(pathname)) return true;
  if (isPotentialKeywordSubpagePath(pathname)) return true;
  if (pathname.startsWith(OUR_ASSET_PREFIX)) return true;
  if (INDEXNOW_KEY_PATTERN.test(pathname)) return true;
  if (isAppNextAsset(pathname, request)) return true;

  return false;
}

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
