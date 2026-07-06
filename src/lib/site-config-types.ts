import type { ExposureMode } from "./exposure-mode";
export type { ExposureMode } from "./exposure-mode";

export interface SiteConfig {
  brandName: string;
  companyName: string;
  tagline: string;
  description: string;
  url: string;
  phone: string;
  email: string;
  address: string;
  businessNumber: string;
  representative: string;
  imageCdn: string;
  imageCount: number;
  supportBase: string;
  supportExtra: string;
  supportMax: string;
  geminiApiKey: string;
  naverClientId: string;
  naverClientSecret: string;
  dailySeoLimit: number;
  naverExposureId: string;
  naverExposurePassword: string;
  serviceAvailableDays: number;
  serviceExpiresAt: string;
  /** cpa: 견적폼만·업체정보 미노출 / company: 업체정보+견적문의 동시 */
  exposureMode: ExposureMode;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "1977철거",
  companyName: "주식회사베룸",
  tagline: "믿을 수 있는 폐업철거 파트너 1977철거",
  description:
    "폐업지원금 신청부터 철거·원상복구까지 한 번에 해결하는 전국 폐업철거 전문 업체입니다. 현장 방문 무료 견적, 지원금 최대 1000만원 상담.",
  url: "https://demolishzone.yourdogzone.co.kr",
  phone: "1555-7321",
  email: "verum614@naver.com",
  address: "인천 서구 이음4로10 KR법조타워2차 610호",
  businessNumber: "260-86-03020",
  representative: "현진호",
  imageCdn: "https://image.cattery.co.kr/chul",
  imageCount: 20,
  supportBase: "600만원",
  supportExtra: "400만원",
  supportMax: "1000만원",
  geminiApiKey: "",
  naverClientId: "",
  naverClientSecret: "",
  dailySeoLimit: 10,
  naverExposureId: "dlscksspwlq",
  naverExposurePassword: "yuna070207",
  serviceAvailableDays: 30,
  serviceExpiresAt: "",
  exposureMode: "company",
};

export function phoneToTel(phone: string): string {
  return phone.replace(/\D/g, "");
}

export type PublicSiteConfig = Omit<SiteConfig, "geminiApiKey"> & {
  phoneTel: string;
};

export function toPublicConfig(config: SiteConfig): PublicSiteConfig {
  const { geminiApiKey: _, ...rest } = config;
  return { ...rest, phoneTel: phoneToTel(rest.phone) };
}
