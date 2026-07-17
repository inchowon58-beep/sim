import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import {
  INQUIRY_SECTION_ID,
  showCompanyContact,
} from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

/** 무료 스톡 영상 (Pexels, 상업적 이용·출처표기 불필요) */
const HERO_VIDEO_SRC = "/videos/hero-dog.mp4";

export default async function HeroE() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);
  const { tenantUi } = await getResolvedSiteConfig();

  const eyebrow = tenantUi?.heroEyebrow || "Dog Surrender & Free Adoption";
  const headline = tenantUi?.heroHeadline || site.brandName;
  const badges = tenantUi?.trustBadges || ["파양 입소", "보호중 아이들", "투명 안내", "빠른 상담"];
  const poster = getImageUrl(tenantUi?.heroImageIndex || 5, site);

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
          <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide mb-5">
            <span className="w-2 h-2 rounded-full bg-[var(--e-yellow)] shadow-[0_0_0_4px_rgba(255,212,0,0.28)]" />
            <span className="text-[var(--e-yellow)]">{eyebrow}</span>
          </p>
          <h1 className="home-e-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.18] mb-5 drop-shadow-md">
            {headline}
          </h1>
          <p className="text-base sm:text-lg leading-relaxed mb-4 max-w-xl drop-shadow-sm">
            <span className="text-[var(--e-yellow)] font-semibold">강아지 파양</span>
            <span className="text-white/80"> · </span>
            <span className="text-[var(--orange)] font-semibold">무료분양</span>
            <span className="text-white/90"> 전문 상담</span>
          </p>
          <p className="text-lg sm:text-xl font-semibold mb-6 drop-shadow-sm">
            <span className="text-[var(--e-yellow)]">강아지 파양</span>
            <span className="text-white/80"> · </span>
            <span className="text-[var(--orange)]">보호중인 아이들</span>
            <span className="text-white">, {site.brandName}가 함께합니다.</span>
          </p>
          <ul className="flex flex-wrap gap-2 mb-8">
            {badges.map((b, i) => (
              <li
                key={b}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-[2px] ${
                  i % 2 === 0
                    ? "bg-[var(--e-yellow)]/20 text-[var(--e-yellow)] border-[var(--e-yellow)]/45"
                    : "bg-[var(--orange)]/20 text-[#ffb078] border-[var(--orange)]/45"
                }`}
              >
                {b}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className="inline-flex items-center justify-center font-bold px-6 py-3.5 text-sm rounded-xl transition shadow-lg bg-white text-slate-900 hover:bg-white/90"
            >
              상담하기
            </Link>
            {showCompany ? (
              <a
                href={`tel:${phoneToTel(site.phone)}`}
                className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl transition border-2 border-white/80 text-white hover:bg-white/10"
              >
                전화하기
              </a>
            ) : (
              <Link
                href="/#surrender"
                className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl transition border-2 border-white/80 text-white hover:bg-white/10"
              >
                파양 입소 안내
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
