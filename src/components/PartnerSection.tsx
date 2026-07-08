"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { INQUIRY_SECTION_ID, inquiryAccentButtonClass, showCompanyContact } from "@/lib/exposure-mode";

export default function PartnerSection() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-dark mb-4">
          {site.brandName}와 함께하는
          <br />
          새 가족 찾기 · 입양 상담
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          파양견·파양묘의 무료분양·무료입양을 희망하시거나, 입소·분양에 대해 궁금하신 점이 있으시면 문의해 주세요.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {showCompany ? (
            <>
              <a
                href={`tel:${site.phoneTel}`}
                className="px-8 py-3 bg-dark text-white font-bold rounded-full hover:bg-dark-light transition"
              >
                무료분양·입양 문의
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="px-8 py-3 border-2 border-dark text-dark font-bold rounded-full hover:bg-gray-50 transition"
              >
                파양 입소 상담
              </a>
            </>
          ) : (
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className={`px-8 py-3 font-bold rounded-full transition ${inquiryAccentButtonClass(site.exposureMode)}`}
            >
              파양·분양 문의하기
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
