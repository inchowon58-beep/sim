import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, isMasterAuthenticated } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/data";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config-types";

const SITE_FIELDS = [
  "brandName",
  "companyName",
  "tagline",
  "description",
  "url",
  "phone",
  "email",
  "address",
  "businessNumber",
  "representative",
  "imageCdn",
  "imageCount",
  "supportBase",
  "supportExtra",
  "supportMax",
  "naverExposureId",
] as const;

export async function GET() {
  if (!(await isAuthenticated()) || !(await isMasterAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getSettings();
  const merged = { ...DEFAULT_SITE_CONFIG, ...settings };
  return NextResponse.json({
    ...merged,
    geminiApiKey: merged.geminiApiKey ? "••••••••" : "",
    naverClientId: merged.naverClientId ? "••••••••" : "",
    naverClientSecret: merged.naverClientSecret ? "••••••••" : "",
    naverExposurePassword: merged.naverExposurePassword || "",
    hasApiKey: !!merged.geminiApiKey,
    hasNaverApi: !!(merged.naverClientId && merged.naverClientSecret),
    hasNaverExposurePassword: !!merged.naverExposurePassword,
  });
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated()) || !(await isMasterAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const current = { ...DEFAULT_SITE_CONFIG, ...(await getSettings()) };
  const updated = { ...current };

  for (const key of SITE_FIELDS) {
    if (body[key] !== undefined && body[key] !== null) {
      if (key === "imageCount") {
        updated.imageCount = Math.max(1, parseInt(String(body.imageCount), 10) || 20);
      } else {
        (updated as Record<string, unknown>)[key] = String(body[key]).trim();
      }
    }
  }

  if (body.dailySeoLimit !== undefined && body.dailySeoLimit !== null) {
    updated.dailySeoLimit = Math.max(0, parseInt(String(body.dailySeoLimit), 10) || 0);
  }

  if (body.geminiApiKey && body.geminiApiKey !== "••••••••") {
    updated.geminiApiKey = body.geminiApiKey;
  }
  if (body.naverClientId && body.naverClientId !== "••••••••") {
    updated.naverClientId = body.naverClientId;
  }
  if (body.naverClientSecret && body.naverClientSecret !== "••••••••") {
    updated.naverClientSecret = body.naverClientSecret;
  }
  if (body.naverExposurePassword && body.naverExposurePassword !== "••••••••") {
    updated.naverExposurePassword = body.naverExposurePassword;
  }

  await saveSettings(updated);
  return NextResponse.json({ success: true });
}
