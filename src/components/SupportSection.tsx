import Image from "next/image";
import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass, showCompanyContact } from "@/lib/exposure-mode";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function SupportSection() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);
  const { tenantUi } = await getResolvedSiteConfig();
  const supportBlurb =
    tenantUi?.supportBlurb ||
    "모든 사설 보호소에는 입소 관리 비용이 발생합니다. 아가펫보호소는 아이 관리에 필요한 현실적인 비용만 항목별로 투명하게 안내합니다.";

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-6 leading-tight">
              현실적인 <span className="text-orange">입소 비용</span>
              <br />
              투명하게 안내
            </h2>
            <p className="text-xl font-bold text-dark mb-4">
              기본 입소 <span className="text-orange text-2xl">{site.supportBase}</span>
              <br />
              추가 케어 <span className="text-orange">{site.supportExtra}</span>
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">{supportBlurb}</p>
            <p className="text-sm text-gray-400">
              *무료 입소를 광고하는 곳은 방문 후 과도한 비용을 요구할 수 있습니다. 입소 전 비용과 시설을 확인하세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {showCompany && (
                <a
                  href={`tel:${phoneToTel(site.phone)}`}
                  className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange-light transition"
                >
                  입소·분양 상담
                </a>
              )}
              <Link
                href={`/#${INQUIRY_SECTION_ID}`}
                className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition ${inquiryAccentButtonClass(site.exposureMode)}`}
              >
                {showCompany ? "빠른 문의" : "빠른 문의 신청하기"}
              </Link>
            </div>
          </div>

          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={getImageUrl(tenantUi?.supportImageIndex || 3, site)}
              alt="입소 비용 안내"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-2">많은 보호자분들이 선택하는 이유</p>
          <h3 className="text-2xl font-bold text-dark">
            파양·무료분양 전문 <span className="text-orange">{site.brandName}</span>
          </h3>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            {site.brandName}는 파양견·파양묘 입소부터 새 가족 매칭, 입소 후 케어까지 책임지고 진행합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
