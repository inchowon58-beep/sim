"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import InquiryLinkButton from "@/components/InquiryLinkButton";
import FooterAdminLinks from "@/components/FooterAdminLinks";
import FooterKeywordAccordion from "@/components/FooterKeywordAccordion";
import { showCompanyContact } from "@/lib/exposure-mode";

export default function FooterB() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <footer className="home-b-footer bg-dark text-white border-t border-white/10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-black mb-1">{site.brandName}</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Pet Care Partner</p>
            <p className="text-sm text-gray-400 leading-relaxed">{site.description}</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm">바로가기</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/#about", label: "회사소개" },
                { href: "/#business", label: "사업영역" },
                { href: "/#cases", label: "파양·분양" },
                { href: "/#reviews", label: "이용후기" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-orange transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm">연락처</h4>
            {showCompany && (
              <p className="text-orange font-bold text-lg mb-2">{site.phone}</p>
            )}
            <p className="text-sm text-gray-400 mb-4">24시간 365일 상시 대기</p>
            <InquiryLinkButton context="cta" className="!rounded-lg" />
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {site.brandName}. All Rights Reserved.
          </p>
          <FooterAdminLinks />
        </div>
        <FooterKeywordAccordion />
      </div>
    </footer>
  );
}
