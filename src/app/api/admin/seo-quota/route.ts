import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSeoQuotaStatus } from "@/lib/seo-quota";
import {
  getServicePeriodStatus,
  purgePagesIfServiceExpired,
} from "@/lib/service-period";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purged = await purgePagesIfServiceExpired();
  const [quota, service] = await Promise.all([
    getSeoQuotaStatus(),
    getServicePeriodStatus(),
  ]);

  return NextResponse.json({ ...quota, service, purged });
}
