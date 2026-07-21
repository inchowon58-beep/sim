import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getCollectionSiteUrl,
  getCollectionStatusMap,
} from "@/lib/collection-queue";
import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

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
    pipelineDisabled: true,
  });
}

/** 순위반영요청 — VM 수집 워커 연동 종료 */
export async function POST() {
  return seoPipelineDisabledResponse();
}
