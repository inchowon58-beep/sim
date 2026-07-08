import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass, showCompanyContact } from "@/lib/exposure-mode";
import QuickInquiryForm from "@/components/QuickInquiryForm";

export default async function CtaB() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section id="cta" className="home-b-section py-16 lg:py-24 bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange mb-2">파양·분양 상담</p>
          <h2 className="text-3xl lg:text-4xl font-black mb-3">
            지금 바로 상담을
            <br />
            신청하세요
          </h2>
          <p className="text-gray-400 text-sm">
            입소 비용 투명 안내 · 빠른 응답 · 책임 있는 매칭
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg transition ${inquiryAccentButtonClass(site.exposureMode)}`}
            >
              빠른 문의 신청하기
            </Link>
            {showCompany && (
              <a
                href={`tel:${phoneToTel(site.phone)}`}
                className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition"
              >
                전화 상담하기
              </a>
            )}
          </div>
        </div>

        <div id={INQUIRY_SECTION_ID} className="max-w-xl mx-auto bg-white rounded-2xl p-6 text-dark shadow-xl">
          <QuickInquiryForm
            keyword={`${site.brandName} 메인`}
            pageSlug=""
            pageTitle={`${site.brandName} 메인`}
            brandName={site.brandName}
            exposureMode={site.exposureMode}
          />
        </div>
      </div>
    </section>
  );
}
