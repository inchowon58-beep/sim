import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass } from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function SupportGrantB() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();

  return (
    <section id="support" className="home-b-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-orange mb-2">입소 비용 안내</p>
            <h2 className="text-3xl lg:text-4xl font-black text-dark leading-tight mb-4">
              투명한 <span className="text-orange">입소 비용</span>
              <br />
              안내
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {tenantUi?.supportBlurb ||
                "모든 사설 보호소에는 입소 관리 비용이 발생합니다. 아이 관리에 필요한 현실적인 비용만 항목별로 투명하게 안내합니다."}
            </p>
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition ${inquiryAccentButtonClass(site.exposureMode)}`}
            >
              입소·분양 상담 신청 →
            </Link>
          </div>

          <div className="home-b-grant-box rounded-3xl bg-gradient-to-br from-dark to-gray-800 text-white p-8 text-center shadow-xl">
            <p className="text-sm text-orange font-semibold mb-2">🐾 입소 비용 안내</p>
            <h3 className="text-xl font-bold mb-6">항목별 투명한 입소 비용</h3>
            <div className="grid grid-cols-2 gap-4 items-end mb-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">기본 입소</p>
                <p className="text-lg font-black text-orange">{site.supportBase}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">추가 케어</p>
                <p className="text-lg font-black text-orange">{site.supportExtra}</p>
              </div>
            </div>
            <p className="text-2xl font-black text-orange mb-2">장기 위탁 {site.supportMax}</p>
            <p className="text-xs text-gray-400">입소 전 비용과 시설을 반드시 확인하세요</p>
          </div>
        </div>
      </div>
    </section>
  );
}
