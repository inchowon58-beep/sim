import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import {
  INQUIRY_SECTION_ID,
  inquiryAccentButtonClass,
  showCompanyContact,
} from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";
import { buildHeroSubcopy } from "@/lib/brand-copy";

/** 무료 스톡 영상 (Pexels, 상업적 이용·출처표기 불필요) */
const HERO_VIDEO_SRC = "/videos/hero-dog.mp4";

export default async function HeroE() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);
  const { tenant, tenantUi } = await getResolvedSiteConfig();

  const eyebrow = tenantUi?.heroEyebrow || "Dog Surrender & Free Adoption";
  const headline = tenantUi?.heroHeadline || site.brandName;
  const subline =
    tenantUi?.heroSubline ||
    tenantUi?.heroSubcopy ||
    buildHeroSubcopy(tenant?.subdomain || site.brandName);
  const badges = tenantUi?.trustBadges || ["파양 입소", "보호중 아이들", "투명 안내", "빠른 상담"];
  const poster = getImageUrl(tenantUi?.heroImageIndex || 1, site);

  return (
    <section className="home-e-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="home-e-hero-video h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="home-e-hero-scrim absolute inset-0" aria-hidden />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 min-h-[78vh] flex items-center">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white/90 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--e-accent)]" />
            {eyebrow}
          </p>
          <h1 className="home-e-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.18] mb-5 drop-shadow-sm">
            {headline}
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-4 max-w-xl">
            {subline}
          </p>
          <p className="text-lg sm:text-xl font-semibold text-white mb-6">
            강아지 파양 · 보호중인 아이들, {site.brandName}가 함께합니다.
          </p>
          <ul className="flex flex-wrap gap-2 mb-8">
            {badges.map((b) => (
              <li
                key={b}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white backdrop-blur-sm"
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className={`inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl transition shadow-lg ${inquiryAccentButtonClass(site.exposureMode)}`}
            >
              빠른 문의
            </Link>
            <Link
              href="/#surrender"
              className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl bg-white/95 text-slate-900 hover:bg-white transition"
            >
              파양 입소 안내
            </Link>
            <Link
              href="/#protected"
              className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl border border-white/40 text-white hover:bg-white/10 transition"
            >
              보호중인 아이들
            </Link>
            {showCompany && (
              <a
                href={`tel:${phoneToTel(site.phone)}`}
                className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl text-white/90 hover:text-white transition"
              >
                {site.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
