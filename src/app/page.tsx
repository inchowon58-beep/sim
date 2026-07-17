import type { Metadata } from "next";
import { pickSeoSuffixKeywords, buildTitleWithSeoSuffix } from "@/lib/seo-title-keywords";
import HomeSections, { HomeLeadBlocks } from "@/components/HomeSections";
import HomePageB from "@/components/home-b/HomePageB";
import HomePageC from "@/components/home-c/HomePageC";
import HomePageD from "@/components/home-d/HomePageD";
import HomePageE from "@/components/home-e/HomePageE";
import { parseSiteDesignId } from "@/lib/site-designs";
import { buildPageMetadata } from "@/lib/metadata";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export async function generateMetadata(): Promise<Metadata> {
  const { config, tenantUi } = await getResolvedSiteConfig();
  const pageTitle = `${config.brandName} | 강아지·고양이 파양·무료분양`;
  const browserTitle = buildTitleWithSeoSuffix(pageTitle, config.brandName);
  const suffixKeywords = pickSeoSuffixKeywords(config.brandName, 3);

  return {
    ...buildPageMetadata(config, {
      title: pageTitle,
      description: config.description,
      path: "/",
      ogPath: "/opengraph-image",
      keywords: [config.brandName, "강아지파양", "고양이파양", "강아지무료분양", "고양이무료분양", ...suffixKeywords],
      geoRegion: tenantUi?.geoRegion,
    }),
    title: { absolute: browserTitle },
  };
}

export default async function HomePage() {
  const { tenantUi } = await getResolvedSiteConfig();

  const siteDesign = parseSiteDesignId(tenantUi?.siteDesign);

  if (siteDesign === "e") {
    return <HomePageE />;
  }

  if (siteDesign === "d") {
    return <HomePageD />;
  }

  if (siteDesign === "c") {
    return <HomePageC />;
  }

  if (siteDesign === "b") {
    return <HomePageB />;
  }

  return (
    <>
      <HomeLeadBlocks />
      <HomeSections />
    </>
  );
}
