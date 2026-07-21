import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deletePage } from "@/lib/data";
import { removeCollectionJobsForPage } from "@/lib/collection-queue";
import { resolvePagesContext } from "@/lib/pages-resolver";
import { deleteTenantPage } from "@/lib/supabase/tenant-pages";
import { getResolvedSiteConfig } from "@/utils/siteConfig";
import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { pages, tenant, isTenant } = await resolvePagesContext();
  return NextResponse.json({ pages, tenantId: tenant?.id ?? null, isTenant });
}

/** 개별 SEO 등록 — Vercel Gemini 생성 종료. 로컬 Python 발행 사용. */
export async function POST() {
  return seoPipelineDisabledResponse();
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { tenant, isTenant } = await getResolvedSiteConfig();

  if (isTenant && tenant) {
    await deleteTenantPage(tenant.id, id);
  } else {
    await deletePage(id);
    await removeCollectionJobsForPage(id);
  }

  return NextResponse.json({ success: true });
}
