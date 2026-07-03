"use client";

import { useState } from "react";
import { NAVER_EXPOSURE_ID } from "@/lib/constants";

export default function NaverExposureCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(NAVER_EXPOSURE_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-[#03C75A]/20 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[#03C75A] px-4 py-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-sm font-black text-[#03C75A]">
          N
        </span>
        <span className="text-sm font-bold text-white tracking-tight">네이버 노출작업</span>
      </div>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#03C75A] mb-1">노출작업 아이디</p>
          <p className="text-lg font-bold text-[#111] tracking-wide font-mono break-all">
            {NAVER_EXPOSURE_ID}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#03C75A]/30 bg-[#03C75A]/5 px-4 py-2.5 text-sm font-semibold text-[#03A94A] transition hover:bg-[#03C75A]/10"
        >
          {copied ? "복사됨 ✓" : "아이디 복사"}
        </button>
      </div>
    </div>
  );
}
