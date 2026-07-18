"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { showCompanyContact } from "@/lib/exposure-mode";

export default function FixedContactBarE() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 home-e-fixed-bar">
      <div className="flex max-w-lg mx-auto rounded-t-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
        <Link
          href="/"
          className="flex-1 text-center py-3.5 text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          홈
        </Link>
        {showCompany && (
          <a
            href={`tel:${site.phoneTel}`}
            className="flex-[1.4] text-center py-3.5 text-xs sm:text-sm font-semibold bg-[var(--e-accent)] text-white hover:opacity-90 transition tabular-nums"
          >
            {site.phone}
          </a>
        )}
      </div>
    </div>
  );
}
