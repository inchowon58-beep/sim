import Image from "next/image";
import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { INQUIRY_SECTION_ID, showCompanyContact } from "@/lib/exposure-mode";

export default async function HeroSection() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section id="about" className="relative min-h-[85vh] flex items-center overflow-hidden">
      <Image
        src={getImageUrl(1, site)}
        alt={`${site.brandName} 폐업철거 전문`}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <span className="inline-block bg-orange text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            폐업 철거, 부담 없이 마무리
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {site.tagline}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed">
            폐업지원금 신청부터 철거·원상복구까지
            <br />
            <strong className="text-orange">{site.brandName}</strong>가 한 번에 해결합니다
          </p>

          <div className="flex flex-wrap gap-3">
            {showCompany && (
              <a
                href={`tel:${phoneToTel(site.phone)}`}
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 rounded-full hover:bg-orange-light transition shadow-lg text-lg"
              >
                무료 상담 전화하기
              </a>
            )}
            <Link
              href={`/#${INQUIRY_SECTION_ID}`}
              className="inline-flex items-center gap-2 bg-dark text-white font-bold px-8 py-4 rounded-full hover:bg-dark-light transition shadow-lg text-lg border border-white/20"
            >
              {showCompany ? "3초 견적문의" : "3초 빠른문의 신청하기"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
