import Image from "next/image";
import Link from "next/link";
import { getSiteConfig, phoneToTel } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { INQUIRY_SECTION_ID, inquiryOnDarkBgClass, showCompanyContact } from "@/lib/exposure-mode";

export default async function CtaSection() {
  const site = await getSiteConfig();
  const showCompany = showCompanyContact(site.exposureMode);

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <Image
        src={getImageUrl(5, site)}
        alt="파양·분양 상담"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-dark/80" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
        <h2 className="text-2xl lg:text-4xl font-bold mb-4">
          강아지·고양이 파양·무료분양
          <br />
          지금 바로 문의하세요
        </h2>
        <p className="text-gray-300 mb-8">
          입소 비용 {site.supportBase} · 추가 케어 {site.supportExtra}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {showCompany && (
            <a
              href={`tel:${phoneToTel(site.phone)}`}
              className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-4 rounded-full hover:bg-orange-light transition shadow-lg"
            >
              전화 상담 {site.phone}
            </a>
          )}
          <Link
            href={`/#${INQUIRY_SECTION_ID}`}
            className={`inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full transition shadow-lg ${inquiryOnDarkBgClass(site.exposureMode)}`}
          >
            {showCompany ? "빠른 문의" : "빠른 문의 신청하기"}
          </Link>
        </div>
      </div>
    </section>
  );
}
