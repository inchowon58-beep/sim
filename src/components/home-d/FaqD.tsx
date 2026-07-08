"use client";

import { useState } from "react";
import { useSiteConfig, useTenantUi } from "@/components/SiteConfigProvider";
import { showCompanyContact } from "@/lib/exposure-mode";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqDProps {
  items: FaqItem[];
}

export default function FaqD({ items }: FaqDProps) {
  const site = useSiteConfig();
  const tenantUi = useTenantUi();
  const showCompany = showCompanyContact(site.exposureMode);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const keyword = tenantUi?.heroKeyword || "파양·무료분양";

  return (
    <section id="faq" className="home-d-section py-16 lg:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 text-center">
          FAQ
        </p>
        <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl text-center text-gray-900 mb-4">
          자주 묻는 <em className="italic text-orange font-normal">질문</em>
        </h2>
        <p className="text-center text-gray-500 text-sm mb-10">
          {keyword}에 대해 자주 묻는 질문을 정리했습니다.
          {showCompany && (
            <>
              {" "}
              <a href={`tel:${site.phoneTel}`} className="text-orange hover:underline">
                {site.phone}
              </a>
            </>
          )}
        </p>

        <div className="divide-y divide-gray-100 border border-gray-100 rounded-sm">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  <span>{item.question}</span>
                  <span className="text-gray-400 shrink-0 text-lg leading-none">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
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
