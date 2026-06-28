import {
  buildRobotsResponse,
} from "@/lib/feed-sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return buildRobotsResponse(request);
}
