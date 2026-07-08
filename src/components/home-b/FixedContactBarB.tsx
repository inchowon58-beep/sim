"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { INQUIRY_SECTION_ID, showCompanyContact } from "@/lib/exposure-mode";

export default function FixedContactBarB() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto flex w-full max-w-md gap-2">
        <Link
          href={`/#${INQUIRY_SECTION_ID}`}
          className="flex-1 text-center py-3.5 rounded-xl bg-orange text-white font-bold text-sm shadow-lg hover:bg-orange-light transition"
        >
          📋 빠른 문의
        </Link>
        {showCompany && (
          <a
            href={`tel:${site.phoneTel}`}
            className="flex-1 text-center py-3.5 rounded-xl bg-dark text-white font-bold text-sm shadow-lg hover:opacity-90 transition"
          >
            📞 전화 상담
          </a>
        )}
      </div>
    </div>
  );
}
