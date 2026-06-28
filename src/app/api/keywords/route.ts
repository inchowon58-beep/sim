import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createKeyword,
  getAllKeywords,
  updateKeyword,
  deactivateKeyword,
} from "@/lib/keywords";
import type { CreateKeywordInput } from "@/types/keyword";

function formatIndexNowResponse(
  indexNow?: Awaited<ReturnType<typeof import("@/lib/indexnow").submitIndexNowForSlug>>
) {
  if (!indexNow) return undefined;
  return {
    status: indexNow.status,
    urlList: indexNow.urlList,
    results: indexNow.results,
    error: indexNow.error,
  };
}

/** GET /api/keywords — 전체 키워드 목록 */
export async function GET() {
  const keywords = await getAllKeywords();
  return NextResponse.json({ keywords });
}

/** POST /api/keywords — 키워드 추가 (즉시 페이지 활성화 + IndexNow) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateKeywordInput;

    if (!body.baseKeyword?.trim()) {
      return NextResponse.json(
        { error: "baseKeyword는 필수입니다." },
        { status: 400 }
      );
    }

    const { entry, indexNow } = await createKeyword(body);

    return NextResponse.json(
      {
        message: "키워드가 등록되었습니다. 페이지가 활성화되었습니다.",
        entry,
        url: `/${encodeURIComponent(entry.slug)}`,
        indexNow: formatIndexNowResponse(indexNow),
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH /api/keywords?slug=xxx — 키워드 수정 (+ IndexNow) */
export async function PATCH(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug 쿼리가 필요합니다." }, { status: 400 });
  }

  const body = await request.json();
  const { entry, indexNow } = await updateKeyword(slug, body);

  if (!entry) {
    return NextResponse.json({ error: "키워드를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({
    entry,
    indexNow: formatIndexNowResponse(indexNow),
  });
}

/** DELETE /api/keywords?slug=xxx — 키워드 비활성화 */
export async function DELETE(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug 쿼리가 필요합니다." }, { status: 400 });
  }

  const ok = await deactivateKeyword(slug);
  if (!ok) {
    return NextResponse.json({ error: "키워드를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ message: "키워드가 비활성화되었습니다." });
}
