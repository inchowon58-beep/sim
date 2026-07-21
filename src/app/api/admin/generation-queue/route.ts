import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getGenerationJobsForAdmin,
  getGenerationQueueSummary,
  getPendingGenerationKeywordsText,
  getRecentGenerationJobs,
  type GenerationJobStatus,
} from "@/lib/generation-queue";
import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

const ADMIN_JOB_STATUSES = new Set<GenerationJobStatus | "all">([
  "all",
  "pending",
  "processing",
  "completed",
  "failed",
]);

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const download = req.nextUrl.searchParams.get("download");
  if (download === "txt") {
    const text = await getPendingGenerationKeywordsText();
    const filename = `generation-queue-pending-${new Date().toISOString().slice(0, 10)}.txt`;
    return new NextResponse(text || "", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const statusParam = req.nextUrl.searchParams.get("status") || "all";
  const status = ADMIN_JOB_STATUSES.has(statusParam as GenerationJobStatus | "all")
    ? (statusParam as GenerationJobStatus | "all")
    : "all";

  const [summary, recent, pendingText, queueResult] = await Promise.all([
    getGenerationQueueSummary(),
    getRecentGenerationJobs(50),
    getPendingGenerationKeywordsText(),
    getGenerationJobsForAdmin(status, 5000),
  ]);

  return NextResponse.json(
    {
      summary,
      recent,
      pendingText,
      jobs: queueResult.jobs,
      scope: queueResult.scope,
      statusFilter: status,
      pipelineDisabled: true,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** 대량 등록 enqueue — VM 연동 종료 */
export async function POST() {
  return seoPipelineDisabledResponse();
}

export async function PUT() {
  return seoPipelineDisabledResponse();
}
