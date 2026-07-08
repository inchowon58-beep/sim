"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { INQUIRY_SECTION_ID, showCompanyContact } from "@/lib/exposure-mode";

export default function FixedContactBarD() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 home-d-fixed-bar">
      <div className="flex max-w-lg mx-auto">
        <Link
          href="/"
          className="flex-1 text-center py-3.5 text-xs sm:text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition border-r border-gray-800"
        >
          🌐 공식홈페이지
        </Link>
        <Link
          href={`/#${INQUIRY_SECTION_ID}`}
          className="flex-1 text-center py-3.5 text-xs sm:text-sm font-medium bg-orange text-white hover:bg-orange-light transition"
        >
          📋 빠른 문의
        </Link>
        {showCompany && (
          <a
            href={`tel:${site.phoneTel}`}
            className="flex-1 text-center py-3.5 text-xs sm:text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition border-l border-gray-700"
          >
            📞 {site.phone}
          </a>
        )}
      </div>
    </div>
  );
}
