import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { INQUIRY_SECTION_ID, showCompanyContact } from "@/lib/exposure-mode";
import QuickInquiryForm from "@/components/QuickInquiryForm";

export default async function ContactD() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section id="contact" className="home-d-section py-16 lg:py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
              {site.brandName}
            </p>
            <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl mb-6 leading-snug">
              Pet Care Expert
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              강아지·고양이 파양·무료분양 전문 보호소입니다.
              <br />
              입소 비용, 파양·분양 절차 등 모든 정보를 책임감 있게 안내합니다.
            </p>

            <dl className="space-y-5 text-sm">
              {showCompany && (
                <div>
                  <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">
                    Contact
                  </dt>
                  <dd>
                    <a
                      href={`tel:${phoneToTel(site.phone)}`}
                      className="text-lg font-medium hover:text-orange transition"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">
                  Homepage
                </dt>
                <dd className="text-gray-300">{site.url.replace(/^https?:\/\//, "")}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">
                  Service
                </dt>
                <dd className="text-gray-300">
                  강아지·고양이 파양 · 무료분양 · 입소 케어 · 입양 매칭
                </dd>
              </div>
            </dl>
          </div>

          <div
            id={INQUIRY_SECTION_ID}
            className="bg-white rounded-sm p-6 sm:p-8 text-gray-900"
          >
            <QuickInquiryForm
              keyword={`${site.brandName} 메인`}
              pageSlug=""
              pageTitle={`${site.brandName} 메인`}
              brandName={site.brandName}
              exposureMode={site.exposureMode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
