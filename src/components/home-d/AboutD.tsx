import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function AboutD() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const keyword = tenantUi?.heroKeyword || "파양·무료분양";
  const bullets = tenantUi?.aboutFeatures?.map((f) => f.description) || [];

  return (
    <section id="about" className="home-d-section py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">About Us</p>
            <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-snug mb-6">
              {site.brandName}
              <br />
              <em className="italic text-orange font-normal">프리미엄 {keyword} 센터</em>
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {tenantUi?.aboutText ||
                `${site.brandName}는 파양견·파양묘 입소부터 무료분양·입양 매칭, 입소 후 케어까지 책임지고 진행하는 보호소입니다.`}
            </p>
          </div>

          <div>
            <ul className="space-y-4">
              {bullets.map((text) => (
                <li key={text} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="text-orange shrink-0 mt-0.5">✓</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-gray-900 hover:text-orange transition tracking-wide"
            >
              서비스 더보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
