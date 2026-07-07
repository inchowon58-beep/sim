/** Supabase site_configs.theme_color */
export interface TenantThemeColor {
  primary: string;
  secondary: string;
  dark: string;
  darkLight?: string;
  cream?: string;
}

/** Supabase site_configs.content_data */
export interface TenantContentData {
  tagline?: string;
  description?: string;
  keywords?: string;
  body?: string;
  supportBase?: string;
  supportExtra?: string;
  supportMax?: string;
  exposureMode?: "cpa" | "company";
  /** classic | modern | bold */
  designVariant?: "classic" | "modern" | "bold";
  /** 사이트 상위 디자인 템플릿: a=기본, b=대안 */
  siteDesign?: "a" | "b";
  /** 생성 시 고정 난수 시드 — 레이아웃·이미지 재현용 */
  layoutSeed?: number;
  headerStyle?: "sticky" | "overlay" | "minimal" | "hidden";
  footerStyle?: "full" | "compact" | "minimal";
  homeLeadBlocks?: ("hero" | "companyStrip")[];
  sectionOrder?: string[];
  hiddenSections?: string[];
  heroBadge?: string;
  heroIntro?: string;
  heroClosing?: string;
  heroLead?: string;
  heroImageIndex?: number;
  supportImageIndex?: number;
  aboutText?: string;
  supportBlurb?: string;
  whyUsTitle?: string;
  whyUsItems?: { num: string; title: string; highlight: string; sub: string }[];
  processSteps?: { step: string; title: string; desc: string }[];
  reviews?: { name: string; business: string; text: string; rating: number }[];
  reviewsSatisfaction?: string;
  stats?: { label: string; value: string; suffix: string }[];
  casesCount?: number;
  casesItems?: { id: string; title: string; type: string; imageIndex: number }[];
  /** B 디자인 전용 */
  heroKeyword?: string;
  heroSubline?: string;
  trustBadges?: string[];
  marqueeLines?: string[];
  aboutFeatures?: { icon: string; title: string; description: string }[];
  businessAreas?: { title: string; description: string; tags: string[]; imageIndex: number }[];
  faqItems?: { question: string; answer: string }[];
  statsGrid?: { label: string; value: string; suffix: string }[];
}

export interface TenantSiteConfigRow {
  id: string;
  site_name: string;
  subdomain: string;
  theme_color: TenantThemeColor;
  content_data: TenantContentData;
  naver_verification: string | null;
  slack_webhook: string | null;
  naver_account_id: string | null;
  /** VM 소유확인 완료 시각 */
  naver_site_registered_at: string | null;
  daily_seo_limit: number | null;
  seo_quota_date: string | null;
  seo_quota_count: number;
  created_at: string;
}

export interface CreateSiteInput {
  siteName: string;
  subdomain: string;
  keywords?: string;
  bodyContent?: string;
  slackWebhook?: string;
  naverVerification?: string;
  /** 미입력 시 마스터 전역 dailySeoLimit 복사 */
  dailySeoLimit?: number | string;
  /** VM 네이버 등록용 계정 */
  naverAccountId?: string;
  /** a | b — 미입력 시 A 디자인 */
  siteDesign?: "a" | "b";
}

export interface NaverAccountSummary {
  id: string;
  naverId: string;
  label: string | null;
  vmLabel: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSiteResult {
  success: boolean;
  siteId?: string;
  subdomain?: string;
  siteUrl?: string;
  themeColor?: TenantThemeColor;
  message?: string;
  error?: string;
  vercelDomain?: { name: string; verified?: boolean };
  naverRegisterQueued?: boolean;
  siteDesign?: "a" | "b";
}

export interface TenantSiteSummary {
  id: string;
  siteName: string;
  subdomain: string;
  siteUrl: string;
  createdAt: string;
  hasSlackWebhook: boolean;
  /** 메타값 설정 여부 (수정 화면용) */
  hasNaverVerification: boolean;
  /** VM 자동 등록용 네이버 계정 연결 여부 */
  hasNaverAccount: boolean;
  /** VM이 네이버 서치어드바이저 등록·소유확인 완료 */
  naverSiteRegistered: boolean;
  siteDesign: "a" | "b";
  dailySeoLimit: number | null;
  designVariant: string | null;
}

export interface TenantSiteDetail extends TenantSiteSummary {
  keywords: string;
  bodyContent: string;
  tagline: string;
  description: string;
  naverVerification: string;
  seoQuotaUsedToday: number;
}

export interface UpdateTenantSiteInput {
  siteName?: string;
  keywords?: string;
  bodyContent?: string;
  tagline?: string;
  description?: string;
  slackWebhook?: string;
  naverVerification?: string;
  dailySeoLimit?: number | string | null;
  /** true 시 네이버 서치어드바이저 등록완료 수동 표시 */
  naverSiteRegistered?: boolean;
}
