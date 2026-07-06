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
}

export interface TenantSiteConfigRow {
  id: string;
  site_name: string;
  subdomain: string;
  theme_color: TenantThemeColor;
  content_data: TenantContentData;
  naver_verification: string | null;
  slack_webhook: string | null;
  created_at: string;
}

export interface CreateSiteInput {
  siteName: string;
  subdomain: string;
  keywords?: string;
  bodyContent?: string;
  slackWebhook?: string;
  naverVerification?: string;
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
}
