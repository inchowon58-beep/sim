"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "@/lib/site-config-types";
import type { TenantContentData } from "@/types/tenant";
import type { FooterKeywordLink } from "@/lib/footer-keywords";
import { phoneToTel } from "@/lib/site-config-types";

export type ClientSiteConfig = SiteConfig & { phoneTel: string };

const SiteConfigContext = createContext<ClientSiteConfig | null>(null);
const TenantUiContext = createContext<TenantContentData | null>(null);
const FooterKeywordLinksContext = createContext<FooterKeywordLink[]>([]);

export function SiteConfigProvider({
  config,
  tenantUi = null,
  footerKeywordLinks = [],
  children,
}: {
  config: SiteConfig;
  tenantUi?: TenantContentData | null;
  footerKeywordLinks?: FooterKeywordLink[];
  children: React.ReactNode;
}) {
  const value: ClientSiteConfig = {
    ...config,
    phoneTel: phoneToTel(config.phone),
  };
  return (
    <SiteConfigContext.Provider value={value}>
      <TenantUiContext.Provider value={tenantUi}>
        <FooterKeywordLinksContext.Provider value={footerKeywordLinks}>
          {children}
        </FooterKeywordLinksContext.Provider>
      </TenantUiContext.Provider>
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): ClientSiteConfig {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error("useSiteConfig must be used within SiteConfigProvider");
  return ctx;
}

export function useTenantUi(): TenantContentData | null {
  return useContext(TenantUiContext);
}

export function useFooterKeywordLinks(): FooterKeywordLink[] {
  return useContext(FooterKeywordLinksContext);
}
