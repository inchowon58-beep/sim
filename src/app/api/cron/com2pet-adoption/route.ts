import { NextRequest, NextResponse } from "next/server";
import {
  getCom2petAdoptionLists,
  syncCom2petAdoptions,
} from "@/lib/com2pet-adoption";

export const runtime = "nodejs";
export const maxDuration = 60;

function authorize(req: NextRequest): boolean {
  // Vercel Cron Jobs send this header
  if (req.headers.get("x-vercel-cron") === "1") return true;

  const auth = req.headers.get("authorization") || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const cronSecret = process.env.CRON_SECRET?.trim();
  const workerSecret = process.env.COLLECTION_WORKER_SECRET?.trim();

  if (cronSecret && bearer === cronSecret) return true;
  if (workerSecret && bearer === workerSecret) return true;
  return false;
}

async function runSync() {
  const result = await syncCom2petAdoptions();
  return NextResponse.json({
    ok: true,
    updatedAt: result.updatedAt,
    dogs: result.dogs.length,
    cats: result.cats.length,
    reviews: result.reviews?.length ?? 0,
  });
}

/**
 * Vercel Cron(하루 1회, 01:00 KST) → GET + CRON_SECRET
 * ?status=1 → 캐시 상태만 조회
 */
export async function GET(req: NextRequest) {
  const statusOnly = req.nextUrl.searchParams.get("status") === "1";
  if (statusOnly) {
    const lists = await getCom2petAdoptionLists();
    return NextResponse.json({
      ok: true,
      fromCache: lists.fromCache,
      updatedAt: lists.updatedAt,
      dogs: lists.dogs.length,
      cats: lists.cats.length,
    });
  }

  if (!authorize(req)) {
    // 비밀키 미설정 로컬에서는 동기화 허용
    if (!process.env.CRON_SECRET?.trim() && !process.env.COLLECTION_WORKER_SECRET?.trim()) {
      try {
        return await runSync();
      } catch (e) {
        const message = e instanceof Error ? e.message : "동기화 실패";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
      }
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await runSync();
  } catch (e) {
    const message = e instanceof Error ? e.message : "동기화 실패";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

/** 수동 동기화 POST + Bearer */
export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    if (!process.env.CRON_SECRET?.trim() && !process.env.COLLECTION_WORKER_SECRET?.trim()) {
      try {
        return await runSync();
      } catch (e) {
        const message = e instanceof Error ? e.message : "동기화 실패";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
      }
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await runSync();
  } catch (e) {
    const message = e instanceof Error ? e.message : "동기화 실패";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
