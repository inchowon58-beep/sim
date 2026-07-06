"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { INQUIRY_SECTION_ID, showCompanyContact } from "@/lib/exposure-mode";

export default function PartnerSection() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-dark mb-4">
          {site.brandName}와 함께할
          <br />
          직영팀 · 파트너 업체 모집
        </h2>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {showCompany ? (
            <>
              <a
                href={`tel:${site.phoneTel}`}
                className="px-8 py-3 bg-dark text-white font-bold rounded-full hover:bg-dark-light transition"
              >
                직영팀 지원
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="px-8 py-3 border-2 border-dark text-dark font-bold rounded-full hover:bg-gray-50 transition"
              >
                파트너 업체 신청
              </a>
            </>
          ) : (
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className="px-8 py-3 bg-dark text-white font-bold rounded-full hover:bg-dark-light transition"
            >
              파트너·팀 지원 문의
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
