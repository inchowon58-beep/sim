import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createKeywordsBulk,
  createKeywordsFromText,
} from "@/lib/keywords";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function formatIndexNowResponse(
  indexNow?: Awaited<
    ReturnType<typeof import("@/lib/indexnow").submitIndexNowForSlug>
  >
) {
  if (!indexNow) return undefined;
  return {
    status: indexNow.status,
    urlList: indexNow.urlList,
    results: indexNow.results,
    error: indexNow.error,
  };
}

/** POST /api/keywords/bulk — txt·키워드 배열 대량 등록 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      text?: string;
      keywords?: string[];
    };

    let result;

    if (typeof body.text === "string" && body.text.trim()) {
      result = await createKeywordsFromText(body.text);
    } else if (Array.isArray(body.keywords) && body.keywords.length > 0) {
      result = await createKeywordsBulk(body.keywords);
    } else {
      return NextResponse.json(
        { error: "text 또는 keywords 배열이 필요합니다." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `${result.created.length}개 키워드가 등록되었습니다.`,
        createdCount: result.created.length,
        failedCount: result.failed.length,
        created: result.created.map((entry) => ({
          id: entry.id,
          slug: entry.slug,
          baseKeyword: entry.baseKeyword,
          title: entry.title,
          createdAt: entry.createdAt,
        })),
        failed: result.failed,
        indexNow: formatIndexNowResponse(result.indexNow),
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
