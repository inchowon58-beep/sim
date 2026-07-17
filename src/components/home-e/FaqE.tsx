"use client";

import { useState } from "react";
import { useSiteConfig, useTenantUi } from "@/components/SiteConfigProvider";
import { showCompanyContact } from "@/lib/exposure-mode";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqEProps {
  items: FaqItem[];
}

export default function FaqE({ items }: FaqEProps) {
  const site = useSiteConfig();
  const tenantUi = useTenantUi();
  const showCompany = showCompanyContact(site.exposureMode);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const keyword = tenantUi?.heroKeyword || "강아지파양";

  if (!items.length) return null;

  return (
    <section id="faq" className="home-e-section py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            FAQ
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            자주 묻는 질문
          </h2>
          <p className="text-sm text-slate-500">
            {keyword}에 대해 자주 묻는 질문입니다.
            {showCompany && (
              <>
                {" "}
                <a href={`tel:${site.phoneTel}`} className="text-[var(--e-accent)] hover:underline font-medium">
                  {site.phone}
                </a>
              </>
            )}
          </p>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <span>{item.question}</span>
                  <span className="text-slate-400 shrink-0 text-lg leading-none">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
