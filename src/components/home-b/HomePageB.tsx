import TopMarqueeB from "@/components/home-b/TopMarqueeB";
import HeroB from "@/components/home-b/HeroB";
import AboutB from "@/components/home-b/AboutB";
import BusinessAreasB from "@/components/home-b/BusinessAreasB";
import ProcessB from "@/components/home-b/ProcessB";
import WhyUsB from "@/components/home-b/WhyUsB";
import RegionsB from "@/components/home-b/RegionsB";
import SupportGrantB from "@/components/home-b/SupportGrantB";
import CasesB from "@/components/home-b/CasesB";
import ReviewsB from "@/components/home-b/ReviewsB";
import FaqB from "@/components/home-b/FaqB";
import CtaB from "@/components/home-b/CtaB";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

/** B 디자인 홈 — cleneo 스타일 레이아웃 */
export default async function HomePageB() {
  const { tenantUi } = await getResolvedSiteConfig();
  const faqItems = tenantUi?.faqItems || [];

  return (
    <>
      <TopMarqueeB />
      <HeroB />
      <AboutB />
      <BusinessAreasB />
      <ProcessB />
      <WhyUsB />
      <RegionsB />
      <SupportGrantB />
      <CasesB />
      <ReviewsB />
      <FaqB items={faqItems} />
      <CtaB />
    </>
  );
}
