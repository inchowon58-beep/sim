import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/site-settings";
import type { UpdateSiteSettingsInput } from "@/types/site-settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateSiteSettingsInput;
    const settings = await updateSiteSettings(body);
    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
