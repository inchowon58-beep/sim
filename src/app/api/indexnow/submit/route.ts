import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { submitIndexNow, submitIndexNowForSlug } from "@/lib/indexnow";

/** POST /api/indexnow/submit — 수동 IndexNow 제출 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      slug?: string;
      urlList?: string[];
    };

    if (body.slug) {
      const result = await submitIndexNowForSlug(body.slug, "manual");
      return NextResponse.json({ result });
    }

    if (body.urlList?.length) {
      const result = await submitIndexNow(body.urlList, "manual");
      return NextResponse.json({ result });
    }

    return NextResponse.json(
      { error: "slug 또는 urlList가 필요합니다." },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
