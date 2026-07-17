import HeroE from "@/components/home-e/HeroE";
import LandingHighlightsE from "@/components/home-e/LandingHighlightsE";
import AboutE from "@/components/home-e/AboutE";
import ServicesE from "@/components/home-e/ServicesE";
import AdoptionGalleryE from "@/components/home-e/AdoptionGalleryE";
import GuideE from "@/components/home-e/GuideE";
import CasesE from "@/components/home-e/CasesE";
import EnvironmentE from "@/components/home-e/EnvironmentE";
import ReviewsE from "@/components/home-e/ReviewsE";
import FaqE from "@/components/home-e/FaqE";
import ContactE from "@/components/home-e/ContactE";
import { getResolvedSiteConfig } from "@/utils/siteConfig";
import { getCom2petAdoptionLists } from "@/lib/com2pet-adoption";

/** E 디자인 홈 — 컴투펫 SaaS 스타일 (강아지파양·무료분양) */
export default async function HomePageE() {
  const { tenantUi } = await getResolvedSiteConfig();
  const faqItems = tenantUi?.faqItems || [];
  const adoptions = await getCom2petAdoptionLists();

  return (
    <>
      <HeroE />
      <LandingHighlightsE />
      <AboutE />
      <ServicesE />
      <AdoptionGalleryE
        dogs={adoptions.dogs}
        cats={adoptions.cats}
        updatedAt={adoptions.updatedAt}
      />
      <GuideE />
      <CasesE />
      <EnvironmentE />
      <ReviewsE />
      <FaqE items={faqItems} />
      <ContactE />
    </>
  );
}
