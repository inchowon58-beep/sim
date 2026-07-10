import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  enqueueAllPendingPages,
  enqueueCollectionRequest,
  getCollectionSiteUrl,
  getCollectionStatusMap,
} from "@/lib/collection-queue";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [statusMap, siteUrl] = await Promise.all([
    getCollectionStatusMap(),
    getCollectionSiteUrl(),
  ]);

  return NextResponse.json({
    siteUrl,
    statuses: Object.fromEntries(statusMap),
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { pageId, all } = body as { pageId?: string; all?: boolean };

  if (all) {
    const result = await enqueueAllPendingPages();
    return NextResponse.json({
      ok: true,
      message: `일괄 순위반영요청: ${result.added}건 등록, ${result.skipped}건 스킵(완료·대기 중)`,
      ...result,
    });
  }

  if (!pageId) {
    return NextResponse.json({ error: "pageId 또는 all=true 필요" }, { status: 400 });
  }

  const result = await enqueueCollectionRequest(pageId);
  return NextResponse.json(result, { status: result.ok ? 200 : 409 });
}
