import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import HeaderB from "@/components/home-b/HeaderB";
import HeaderC from "@/components/home-c/HeaderC";
import FooterWrapper from "@/components/FooterWrapper";
import FooterB from "@/components/home-b/FooterB";
import FooterC from "@/components/home-c/FooterC";
import FixedContactBar from "@/components/FixedContactBar";
import FixedContactBarB from "@/components/home-b/FixedContactBarB";
import FixedContactBarC from "@/components/home-c/FixedContactBarC";
import HeaderD from "@/components/home-d/HeaderD";
import FooterD from "@/components/home-d/FooterD";
import FixedContactBarD from "@/components/home-d/FixedContactBarD";
import HeaderE from "@/components/home-e/HeaderE";
import FooterE from "@/components/home-e/FooterE";
import FixedContactBarE from "@/components/home-e/FixedContactBarE";
import TenantThemeStyles from "@/components/TenantThemeStyles";
import { SiteConfigProvider } from "@/components/SiteConfigProvider";
import { getResolvedSiteConfig } from "@/utils/siteConfig";
import { buildSiteMetadata } from "@/lib/metadata";
import { NAVER_SITE_VERIFICATION } from "@/lib/constants";
import { parseSiteDesignId } from "@/lib/site-designs";
import { showCompanyContact } from "@/lib/exposure-mode";
import { resolveFooterKeywordLinks } from "@/lib/footer-keywords";

export async function generateMetadata(): Promise<Metadata> {
  const { config, tenant, tenantUi } = await getResolvedSiteConfig();
  const meta = buildSiteMetadata(config, { geoRegion: tenantUi?.geoRegion });
  if (tenant?.naver_verification) {
    return {
      ...meta,
      other: {
        ...(meta.other || {}),
        "naver-site-verification": tenant.naver_verification,
      },
    };
  }
  return meta;
}

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { config, tenant, tenantUi, theme } = await getResolvedSiteConfig();
  const footerKeywordLinks = await resolveFooterKeywordLinks(
    tenantUi?.footerKeywords
  );
  const showCompany = showCompanyContact(config.exposureMode);
  const naverVerification =
    tenant?.naver_verification?.trim() || NAVER_SITE_VERIFICATION;
  const headerStyle = tenantUi?.headerStyle || "sticky";
  const siteDesign = parseSiteDesignId(tenantUi?.siteDesign);
  const isDesignB = siteDesign === "b";
  const isDesignC = siteDesign === "c";
  const isDesignD = siteDesign === "d";
  const isDesignE = siteDesign === "e";
  const isAltDesign = isDesignB || isDesignC || isDesignD || isDesignE;
  const bodyClasses = [
    "antialiased",
    `tenant-design-${siteDesign}`,
    isDesignB ? "home-b-root" : "",
    isDesignC ? "home-c-root" : "",
    isDesignD ? "home-d-root" : "",
    isDesignE ? "home-e-root" : "",
    !isAltDesign && tenantUi?.designVariant ? `tenant-${tenantUi.designVariant}` : "",
    !isAltDesign && headerStyle === "overlay" ? "tenant-header-overlay" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const businessJsonLd = showCompany
    ? {
        "@context": "https://schema.org",
        "@type": "AnimalShelter",
        name: config.brandName,
        legalName: config.companyName,
        description: config.description,
        telephone: config.phone,
        email: config.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: config.address,
          addressCountry: "KR",
        },
        founder: {
          "@type": "Person",
          name: config.representative,
        },
        areaServed: {
          "@type": "Country",
          name: "대한민국",
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: config.brandName,
        description: config.description,
        url: config.url,
      };

  return (
    <html lang="ko">
      <head>
        <TenantThemeStyles theme={theme} />
        <meta
          name="naver-site-verification"
          content={naverVerification}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${config.brandName} RSS`}
          href="/feed.xml"
        />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessJsonLd),
          }}
        />
      </head>
      <body className={`${bodyClasses} min-h-screen flex flex-col`}>
        <SiteConfigProvider
          config={config}
          tenantUi={tenantUi}
          footerKeywordLinks={footerKeywordLinks}
        >
          {isDesignE ? (
            <>
              <HeaderE />
              <main className="flex-1">{children}</main>
              <FooterE />
              <FixedContactBarE />
            </>
          ) : isDesignD ? (
            <>
              <HeaderD />
              <main className="flex-1">{children}</main>
              <FooterD />
              <FixedContactBarD />
            </>
          ) : isDesignC ? (
            <>
              <HeaderC />
              <main className="flex-1">{children}</main>
              <FooterC />
              <FixedContactBarC />
            </>
          ) : isDesignB ? (
            <>
              <HeaderB />
              <main className="flex-1">{children}</main>
              <FooterB />
              <FixedContactBarB />
            </>
          ) : (
            <>
              {headerStyle !== "hidden" && <Header headerStyle={headerStyle} />}
              <main className="flex-1 pb-24">{children}</main>
              <FooterWrapper />
              <FixedContactBar />
            </>
          )}
        </SiteConfigProvider>
      </body>
    </html>
  );
}
