import Image from "next/image";
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
  const badges = tenantUi?.trustBadges || ["파양 입소", "무료분양", "투명 안내", "빠른 상담"];

  return (
    <section className="home-e-hero relative overflow-hidden">
      <div className="absolute inset-0 home-e-hero-bg" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[var(--e-accent)] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--e-accent)]" />
              {eyebrow}
            </p>
            <h1 className="home-e-display text-3xl sm:text-4xl lg:text-[2.75rem] text-slate-900 leading-[1.2] mb-5">
              {headline}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-xl">
              {subline}
            </p>
            <ul className="flex flex-wrap gap-2 mb-8">
              {badges.map((b) => (
                <li
                  key={b}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm"
                >
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/#${INQUIRY_SECTION_ID}`}
                className={`inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl transition shadow-sm ${inquiryAccentButtonClass(site.exposureMode)}`}
              >
                빠른 문의
              </Link>
              <Link
                href="/#surrender"
                className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl bg-white text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
              >
                파양 입소 안내
              </Link>
              {showCompany && (
                <a
                  href={`tel:${phoneToTel(site.phone)}`}
                  className="inline-flex items-center justify-center font-semibold px-6 py-3.5 text-sm rounded-xl text-slate-700 hover:text-[var(--e-accent)] transition"
                >
                  {site.phone}
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="home-e-float-badge left-2 top-8 sm:-left-8">
              <span className="home-e-mini-icon" aria-hidden>
                01
              </span>
              <span>입소상담</span>
            </div>
            <div className="home-e-float-badge right-1 bottom-16 sm:-right-8">
              <span className="home-e-mini-icon" aria-hidden>
                02
              </span>
              <span>무료분양</span>
            </div>
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
              <Image
                src={getImageUrl(tenantUi?.heroImageIndex || 1, site)}
                alt={`${site.brandName} 강아지 파양·무료분양`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <p className="text-white text-sm font-medium">
                  {tenantUi?.heroKeyword || "강아지파양 · 무료분양"}
                </p>
                <p className="text-white/80 text-xs mt-1">상담 후 방문 예약제로 안내합니다</p>
              </div>
            </div>
            <div className="absolute -z-10 -right-6 -bottom-6 w-48 h-48 rounded-full bg-[var(--e-accent-soft)] blur-3xl opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
