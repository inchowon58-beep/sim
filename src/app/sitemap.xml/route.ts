import { buildSitemapResponse } from "@/lib/feed-sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return buildSitemapResponse(request);
}
