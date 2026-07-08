import Image from "next/image";
import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass, showCompanyContact } from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function HeroD() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);
  const { tenantUi } = await getResolvedSiteConfig();

  const eyebrow = tenantUi?.heroEyebrow || "Premium Pet Care Center";
  const keyword = tenantUi?.heroKeyword || "강아지·고양이 파양";
  const subline =
    tenantUi?.heroSubline ||
    `파양·무료분양과 체계적인 입소 케어를 경험하세요`;

  return (
    <section className="home-d-hero relative min-h-[85vh] flex items-center overflow-hidden bg-gray-900">
      <Image
        src={getImageUrl(tenantUi?.heroImageIndex || 1, site)}
        alt={`${site.brandName} ${keyword} 전문`}
        fill
        className="object-cover opacity-50"
        priority
      />
      <div className="home-d-hero-overlay absolute inset-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
        <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-orange/90 mb-6 font-medium">
          {eyebrow}
        </p>

        <h1 className="home-d-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-6">
          <span className="font-semibold">{keyword} 전문</span>
          <br />
          <span className="font-light italic text-white/95">{site.brandName}</span>
          <br />
          <span className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-300 tracking-wide">
            Trusted <em className="not-italic text-orange">Pet Care</em>
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          {subline}
          <br />
          <span className="text-gray-400">{site.brandName}</span>
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/#${INQUIRY_SECTION_ID}`}
            className={`inline-flex items-center gap-2 font-medium px-8 py-3.5 text-sm tracking-wide transition ${inquiryAccentButtonClass(site.exposureMode)} !rounded-sm`}
          >
            빠른 문의 신청
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 font-medium px-8 py-3.5 text-sm tracking-wide bg-white/10 text-white border border-white/25 hover:bg-white/20 transition rounded-sm"
          >
            센터 소개
          </Link>
          {showCompany && (
            <a
              href={`tel:${phoneToTel(site.phone)}`}
              className="inline-flex items-center gap-2 font-medium px-8 py-3.5 text-sm tracking-wide text-white/80 hover:text-white transition"
            >
              {site.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
