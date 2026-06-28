import { NextResponse } from "next/server";
import { getStorageStatus } from "@/lib/data-store";

export async function GET() {
  const status = await getStorageStatus();
  return NextResponse.json(status);
}
