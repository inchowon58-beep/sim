import type { SiteSettings, UpdateSiteSettingsInput } from "@/types/site-settings";
import settingsSeed from "../../data/site-settings.json";
import { readJsonObject, writeJsonObject } from "./data-store";

const DATA_FILE = "data/site-settings.json";
const DEFAULT_BRAND = "아가펫스토리";

function normalizeSeed(): SiteSettings {
  const seed = settingsSeed as SiteSettings;
  return {
    brandName: seed.brandName?.trim() || DEFAULT_BRAND,
    updatedAt: seed.updatedAt ?? new Date(0).toISOString(),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await readJsonObject<SiteSettings>(DATA_FILE, normalizeSeed());
  return {
    brandName: settings.brandName?.trim() || DEFAULT_BRAND,
    updatedAt: settings.updatedAt ?? new Date().toISOString(),
  };
}

export async function getBrandName(): Promise<string> {
  const settings = await getSiteSettings();
  return settings.brandName;
}

export async function updateSiteSettings(
  input: UpdateSiteSettingsInput
): Promise<SiteSettings> {
  const brandName = input.brandName?.trim();
  if (!brandName) {
    throw new Error("업체명을 입력하세요.");
  }
  if (brandName.length > 40) {
    throw new Error("업체명은 40자 이내로 입력하세요.");
  }

  const next: SiteSettings = {
    brandName,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonObject(DATA_FILE, next);
  return next;
}
