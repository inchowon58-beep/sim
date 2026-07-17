import HeroE from "@/components/home-e/HeroE";
import AboutE from "@/components/home-e/AboutE";
import ServicesE from "@/components/home-e/ServicesE";
import GuideE from "@/components/home-e/GuideE";
import CasesE from "@/components/home-e/CasesE";
import ReviewsE from "@/components/home-e/ReviewsE";
import FaqE from "@/components/home-e/FaqE";
import ContactE from "@/components/home-e/ContactE";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

/** E 디자인 홈 — 컴투펫 SaaS 스타일 (강아지파양·무료분양) */
export default async function HomePageE() {
  const { tenantUi } = await getResolvedSiteConfig();
  const faqItems = tenantUi?.faqItems || [];

  return (
    <>
      <HeroE />
      <AboutE />
      <ServicesE />
      <GuideE />
      <CasesE />
      <ReviewsE />
      <FaqE items={faqItems} />
      <ContactE />
    </>
  );
}
