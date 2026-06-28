import { buildRssResponse } from "@/lib/feed-sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** /rss.xml — /feed.xml 과 동일 RSS */
export async function GET(request: Request) {
  return buildRssResponse(request);
}
