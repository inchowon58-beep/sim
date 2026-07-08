import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { showCompanyContact } from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function MissionC() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);
  const { tenantUi } = await getResolvedSiteConfig();

  const lines = tenantUi?.missionLines || ["가정견·가정묘", "파양·분양", "전문 센터."];
  const body =
    tenantUi?.missionBody ||
    `${site.brandName}은 더 이상 함께하기 어려운 가정견·가정묘의 파양 입소와 강아지·고양이 무료분양·무료입양 매칭을 진행하는 프리미엄 요양보육 센터입니다.`;

  return (
    <section className="home-c-section py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-6">Our Mission</p>

        <h2 className="home-c-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-[1.2] mb-8">
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="text-stone-600 leading-relaxed max-w-2xl text-base sm:text-lg whitespace-pre-line">
          {body}
        </p>

        {showCompany && (
          <p className="mt-10 text-sm text-stone-500">
            지금 바로 상담이 필요하시다면{" "}
            <a href={`tel:${phoneToTel(site.phone)}`} className="font-semibold text-stone-900 hover:text-orange transition">
              {site.phone}
            </a>
          </p>
        )}

        <div className="mt-16 grid grid-cols-3 gap-6 max-w-md">
          <div>
            <p className="text-2xl sm:text-3xl font-light text-stone-900">3,200+</p>
            <p className="text-xs text-stone-400 mt-1">분양·입양 매칭</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400">투명한 입소 · 책임 매칭</p>
          </div>
        </div>
      </div>
    </section>
  );
}
