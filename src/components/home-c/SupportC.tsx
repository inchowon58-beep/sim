import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass } from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function SupportC() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();

  const blurb =
    tenantUi?.supportBlurb ||
    "모든 사설 보호소에는 입소 관리 비용이 발생합니다. 아가펫보호소는 아이 관리에 필요한 현실적인 비용만 항목별로 투명하게 안내합니다.";

  return (
    <section id="support" className="home-c-section py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-stone-400 mb-6">Intake Fee</p>

        <h2 className="home-c-editorial text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 leading-[1.2] mb-6">
          현실적인
          <br />
          입소 비용 안내
        </h2>

        <p className="text-stone-600 leading-relaxed max-w-2xl text-base sm:text-lg mb-8">
          {blurb}
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-10 max-w-3xl">
          <div className="rounded-2xl border border-stone-100 p-5">
            <p className="text-xs text-stone-400 mb-1">기본 입소 관리</p>
            <p className="text-xl font-light text-stone-900">{site.supportBase || "15만원대~"}</p>
            <p className="text-xs text-stone-500 mt-2">건강검진·일상 케어 포함</p>
          </div>
          <div className="rounded-2xl border border-stone-100 p-5">
            <p className="text-xs text-stone-400 mb-1">추가 케어</p>
            <p className="text-xl font-light text-stone-900">{site.supportExtra || "35만원대~"}</p>
            <p className="text-xs text-stone-500 mt-2">미용·치료·특별 관리</p>
          </div>
          <div className="rounded-2xl border border-stone-100 p-5">
            <p className="text-xs text-stone-400 mb-1">장기 위탁</p>
            <p className="text-xl font-light text-stone-900">{site.supportMax || "상담 후 안내"}</p>
            <p className="text-xs text-stone-500 mt-2">기간·종·크기별 맞춤</p>
          </div>
        </div>

        <p className="text-xs text-stone-400 mb-8 max-w-2xl">
          * 무료 입소를 광고하는 곳은 방문 후 멤버십·용품 등 과도한 비용을 요구하거나 관리가 미흡한 경우가 많습니다.
          입소 전 반드시 항목별 비용과 시설을 확인하세요.
        </p>

        <Link
          href={`/#${INQUIRY_SECTION_ID}`}
          className={`inline-flex items-center gap-2 font-medium px-7 py-3.5 rounded-full transition text-sm ${inquiryAccentButtonClass(site.exposureMode)}`}
        >
          입소·분양 문의하기
        </Link>
      </div>
    </section>
  );
}
