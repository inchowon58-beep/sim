import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSeoQuotaStatus } from "@/lib/seo-quota";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const quota = await getSeoQuotaStatus();
  return NextResponse.json(quota);
}
