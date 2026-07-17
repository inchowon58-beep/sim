import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function AboutE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const keyword = tenantUi?.heroKeyword || "강아지파양";
  const bullets = tenantUi?.aboutFeatures || [];
  const supportImg = tenantUi?.supportImageIndex || 2;

  return (
    <section id="about" className="home-e-section py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-slate-200 shadow-lg">
              <Image
                src={getImageUrl(supportImg, site)}
                alt={`${site.brandName} 센터 소개`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
              About
            </p>
            <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 leading-snug mb-4">
              {site.brandName}
              <span className="block text-slate-500 font-normal text-xl sm:text-2xl mt-2">
                {keyword} 전문 상담
              </span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-8">
              {tenantUi?.aboutText ||
                `${site.brandName}는 강아지 파양 입소와 무료분양을 전문으로 안내합니다.`}
            </p>
            <ul className="space-y-3 mb-8">
              {bullets.map((f) => (
                <li
                  key={f.description}
                  className="flex gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--e-accent-soft)] text-[var(--e-accent)] text-xs font-bold">
                    ✓
                  </span>
                  <span>{f.description}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/#guide"
              className="inline-flex text-sm font-semibold text-[var(--e-accent)] hover:underline"
            >
              입소 안내 보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
