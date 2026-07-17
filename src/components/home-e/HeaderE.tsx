"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import InquiryLinkButton from "@/components/InquiryLinkButton";
import { showCompanyContact } from "@/lib/exposure-mode";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/#about", label: "센터소개" },
  { href: "/#surrender", label: "입소하기" },
  { href: "/#adoption", label: "입양하기" },
  { href: "/#adoption-gallery", label: "책임분양" },
  { href: "/#protected", label: "보호중인 아이들" },
  { href: "/#environment", label: "환경안내" },
  { href: "/#centers", label: "지역상담" },
  { href: "/#guide", label: "입소안내" },
] as const;

export default function HeaderE() {
  const site = useSiteConfig();
  const [open, setOpen] = useState(false);
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <header className="home-e-header sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          <Link href="/" className="shrink-0 min-w-0">
            <span className="block text-[15px] sm:text-base font-semibold text-slate-900 tracking-tight truncate">
              {site.brandName}
            </span>
            <span className="block text-[11px] text-slate-500 mt-0.5 truncate">
              {site.tagline}
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2.5 py-2 text-sm text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {showCompany && (
              <a
                href={`tel:${site.phoneTel}`}
                className="text-sm font-semibold text-slate-800 hover:text-[var(--e-accent)] transition tabular-nums"
              >
                {site.phone}
              </a>
            )}
            <InquiryLinkButton
              context="header"
              className="!rounded-xl !px-4 !py-2 !text-sm !font-semibold"
            />
          </div>

          <button
            type="button"
            className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
          >
            <span className="sr-only">메뉴</span>
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 shadow-lg">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {showCompany && (
            <a
              href={`tel:${site.phoneTel}`}
              className="block rounded-xl px-3 py-3 text-sm font-semibold text-[var(--e-accent)]"
              onClick={() => setOpen(false)}
            >
              {site.phone}
            </a>
          )}
          <InquiryLinkButton
            context="header"
            className="w-full justify-center !rounded-xl mt-2"
          />
        </div>
      )}
    </header>
  );
}
