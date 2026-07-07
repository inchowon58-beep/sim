"use client";

import Link from "next/link";
import FooterAdminLinks from "@/components/FooterAdminLinks";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { showCompanyContact } from "@/lib/exposure-mode";

export default function FooterC() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <footer className="home-c-footer bg-stone-950 text-stone-400 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <p className="text-2xl font-light text-white mb-1">{site.brandName}</p>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-600 mb-6">
              Demolition Partner
            </p>
            <blockquote className="text-sm leading-relaxed text-stone-500 italic">
              &ldquo;투명한 견적으로,
              <br />
              <em className="not-italic text-stone-400">끝까지</em> 곁을 지킵니다.&rdquo;
            </blockquote>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-600 mb-4">
              {site.brandName} · 함께 걷는 사람들
            </p>
            {showCompany && (
              <Link
                href={`tel:${site.phoneTel}`}
                className="text-white hover:text-orange transition text-sm"
              >
                상담하기 — {site.phone}
              </Link>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} <span className="text-stone-500">{site.brandName}</span>
          </p>
          <FooterAdminLinks />
        </div>
      </div>
    </footer>
  );
}
