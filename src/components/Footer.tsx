"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import InquiryLinkButton from "@/components/InquiryLinkButton";
import LoginModal from "./LoginModal";
import FooterKeywordAccordion from "@/components/FooterKeywordAccordion";
import { showCompanyContact } from "@/lib/exposure-mode";

interface FooterProps {
  isLoggedIn?: boolean;
}

export default function Footer({ isLoggedIn = false }: FooterProps) {
  const site = useSiteConfig();
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const showCompany = showCompanyContact(site.exposureMode);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      <footer id="contact" className="bg-dark text-white pb-20 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className={`grid gap-10 ${showCompany ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            <div>
              <h3 className="text-xl font-bold mb-1">{site.brandName}</h3>
              {showCompany && (
                <p className="text-sm text-gray-400 mb-4">{site.companyName}</p>
              )}
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {site.description}
              </p>
              <p className="text-orange text-sm font-medium">
                입소 비용 {site.supportBase}부터 · 장기 위탁 {site.supportMax}
              </p>
              {!showCompany && site.url && (
                <p className="mt-3 text-sm text-gray-400">
                  <a href={site.url} className="hover:text-orange transition">
                    {site.url.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>

            {showCompany ? (
              <>
                <div>
                  <h4 className="font-semibold mb-4 text-orange">Contact</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>
                      📞{" "}
                      <a href={`tel:${site.phoneTel}`} className="hover:text-orange transition">
                        {site.phone}
                      </a>
                    </li>
                    <li>
                      ✉️{" "}
                      <a href={`mailto:${site.email}`} className="hover:text-orange transition">
                        {site.email}
                      </a>
                    </li>
                    <li>📍 {site.address}</li>
                  </ul>
                  <div className="mt-4">
                    <InquiryLinkButton context="header" className="text-sm" />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-orange">사업자 정보</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>회사명: {site.companyName}</li>
                    <li>대표: {site.representative}</li>
                    <li>사업자등록번호: {site.businessNumber}</li>
                  </ul>
                  <h4 className="font-semibold mb-3 mt-6 text-orange">서비스</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>강아지·고양이 파양</li>
                    <li>강아지·고양이 무료분양</li>
                    <li>입소 비용 안내</li>
                    <li>분양·입양 상담</li>
                  </ul>
                </div>
              </>
            ) : (
              <div>
                <h4 className="font-semibold mb-4 text-orange">문의하기</h4>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                  전화 상담 없이 아래 문의 폼으로 빠르게 파양·분양 상담을 신청해 주세요.
                </p>
                <InquiryLinkButton context="header" />
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              © 2026 {showCompany ? site.companyName : site.brandName}. All rights reserved.
            </p>

            <div className="flex items-center gap-3 shrink-0">
              {loggedIn ? (
                <>
                  <Link
                    href="/admin"
                    className="text-sm px-4 py-2 rounded-full bg-orange text-white font-medium hover:bg-orange-light transition"
                  >
                    관리자 페이지
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
                >
                  로그인
                </button>
              )}
            </div>
          </div>

          <FooterKeywordAccordion tone="dark" />
        </div>
      </footer>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={() => {
            setLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
}
