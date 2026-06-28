import { NextRequest, NextResponse } from "next/server";
import { getKeywordBySlug } from "@/lib/keywords";
import { fetchProxiedPage } from "@/lib/html-proxy";
import { buildSeoMeta, resolveCanonicalBase } from "@/lib/seo";

export const revalidate = 60;

/**
 * SEO 서브페이지 — 서버 프록시
 * 아가펫스토리 HTML을 fetch → 키워드 SEO head 주입 → 그대로 반환
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const entry = await getKeywordBySlug(slug);

  if (!entry) {
    return new NextResponse("페이지를 찾을 수 없습니다.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "https";
  const canonicalBase = resolveCanonicalBase(host, protocol);
  const seoMeta = buildSeoMeta(entry, canonicalBase, entry.ogImage);

  try {
    const html = await fetchProxiedPage(seoMeta);
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy failed";
    console.error("[slug-proxy]", slug, message);
    return new NextResponse(`프록시 오류: ${message}`, {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
