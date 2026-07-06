export type ExposureMode = "cpa" | "company";

export const DEFAULT_EXPOSURE_MODE: ExposureMode = "company";

export function resolveExposureMode(value: unknown): ExposureMode {
  return value === "cpa" ? "cpa" : "company";
}

export function isCpaExposure(mode: ExposureMode): boolean {
  return mode === "cpa";
}

export function showCompanyContact(mode: ExposureMode): boolean {
  return mode === "company";
}

export const INQUIRY_SECTION_ID = "quick-inquiry";

export function inquiryHref(pathname: string): string {
  if (pathname.startsWith("/guide/")) return `#${INQUIRY_SECTION_ID}`;
  return `/#${INQUIRY_SECTION_ID}`;
}

export function inquiryButtonLabel(mode: ExposureMode, context: "header" | "floating" | "cta"): string {
  if (mode === "cpa") {
    if (context === "header") return "3초 빠른문의 신청하기";
    return "3초 견적신청 문의하기";
  }
  if (context === "header" || context === "floating") return "3초 견적문의";
  return "3초 견적문의";
}

export function inquiryFormTitle(mode: ExposureMode): string {
  return mode === "cpa" ? "3초 견적신청 문의하기" : "3초 견적신청 문의하기";
}
