import { getSettings, saveSettings } from "./data";
import { DEFAULT_SITE_CONFIG } from "./site-config-types";

export interface SeoQuotaStatus {
  limit: number;
  used: number;
  remaining: number;
  today: string;
}

function todayKst(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

export async function getSeoQuotaStatus(): Promise<SeoQuotaStatus> {
  const settings = await getSettings();
  const merged = { ...DEFAULT_SITE_CONFIG, ...settings };
  const today = todayKst();
  const limit = Math.max(0, merged.dailySeoLimit ?? 10);
  const used =
    settings.seoQuotaDate === today ? Math.max(0, settings.seoQuotaCount ?? 0) : 0;

  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    today,
  };
}

export async function consumeSeoQuota(): Promise<boolean> {
  const status = await getSeoQuotaStatus();
  if (status.remaining <= 0) return false;

  const settings = await getSettings();
  const today = todayKst();
  const used =
    settings.seoQuotaDate === today ? Math.max(0, settings.seoQuotaCount ?? 0) : 0;

  await saveSettings({
    ...settings,
    seoQuotaDate: today,
    seoQuotaCount: used + 1,
  });
  return true;
}
