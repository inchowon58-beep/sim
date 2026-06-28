import { NextResponse } from "next/server";
import { getIndexNowLogs } from "@/lib/indexnow-log";
import { getIndexNowConfig } from "@/lib/indexnow";

/** GET /api/indexnow/logs — IndexNow 전송 로그 조회 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") ?? 50))
  );

  const logs = await getIndexNowLogs(limit);
  const config = getIndexNowConfig();

  return NextResponse.json({
    configured: Boolean(config?.key),
    enabled: config?.enabled ?? false,
    host: config?.host,
    keyLocation: config?.keyLocation,
    logs,
  });
}
