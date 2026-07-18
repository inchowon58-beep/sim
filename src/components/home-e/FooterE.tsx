"use client";

import FooterAdminLinks from "@/components/FooterAdminLinks";
import FooterKeywordAccordion from "@/components/FooterKeywordAccordion";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { showCompanyContact } from "@/lib/exposure-mode";

export default function FooterE() {
  const site = useSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <footer id="contact" className="home-e-footer bg-slate-950 text-slate-400 pb-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{site.brandName}</h3>
            <p className="text-[11px] tracking-wide text-slate-500 mb-4">{site.tagline}</p>
            <p className="text-sm leading-relaxed text-slate-500">{site.description}</p>
          </div>

          <div>
            <h4 className="text-xs tracking-wider uppercase text-slate-500 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              {showCompany && (
                <li>
                  <strong className="text-slate-300">문의</strong>{" "}
                  <a
                    href={`tel:${site.phoneTel}`}
                    className="hover:text-[var(--e-accent)] transition tabular-nums"
                  >
                    {site.phone}
                  </a>
                </li>
              )}
              <li>
                <strong className="text-slate-300">홈페이지</strong>{" "}
                {site.url.replace(/^https?:\/\//, "")}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-wider uppercase text-slate-500 mb-4">Service</h4>
            <p className="text-sm leading-relaxed text-slate-400">
              강아지 파양 · 무료분양 · 입소 케어 · 입양 매칭
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-wide text-slate-600">
            © {site.brandName} ALL RIGHTS RESERVED.
          </p>
          <FooterAdminLinks />
        </div>
        <FooterKeywordAccordion />
      </div>
    </footer>
  );
}
