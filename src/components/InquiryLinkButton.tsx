"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/components/SiteConfigProvider";
import { inquiryButtonLabel, inquiryHref } from "@/lib/exposure-mode";

type InquiryButtonContext = "header" | "floating" | "cta";

const baseClass =
  "inline-flex items-center justify-center font-bold transition whitespace-nowrap";

const variants: Record<InquiryButtonContext, string> = {
  header:
    "px-5 py-2.5 bg-dark text-white text-sm rounded-full hover:bg-dark-light border border-dark",
  floating:
    "pointer-events-auto flex-col gap-0.5 bg-dark text-white py-3.5 px-5 sm:px-6 rounded-full shadow-lg hover:bg-dark-light active:scale-[0.98]",
  cta: "px-8 py-4 bg-dark text-white rounded-full hover:bg-dark-light transition shadow-lg text-lg",
};

interface InquiryLinkButtonProps {
  context: InquiryButtonContext;
  className?: string;
  onClick?: () => void;
}

export default function InquiryLinkButton({
  context,
  className = "",
  onClick,
}: InquiryLinkButtonProps) {
  const site = useSiteConfig();
  const pathname = usePathname();
  const href = inquiryHref(pathname);
  const label = inquiryButtonLabel(site.exposureMode, context);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClass} ${variants[context]} ${className}`}
    >
      {context === "floating" ? (
        <>
          <span className="text-[11px] sm:text-xs text-white/90">빠른 견적 신청</span>
          <span className="font-bold text-sm sm:text-base">{label}</span>
        </>
      ) : (
        label
      )}
    </Link>
  );
}
