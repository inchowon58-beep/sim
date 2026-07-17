import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const ENV_ITEMS = [
  {
    title: "쾌적한 생활 공간",
    desc: "입소 후 아이가 안정적으로 지낼 수 있도록 공간과 생활 루틴을 관리합니다.",
  },
  {
    title: "일상 케어",
    desc: "산책, 목욕, 식사, 기본 건강 상태 확인까지 꾸준하게 체크합니다.",
  },
  {
    title: "성향 기반 매칭",
    desc: "아이의 성격과 보호자의 환경을 함께 확인해 무료분양을 진행합니다.",
  },
] as const;

export default async function EnvironmentE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const base = tenantUi?.heroImageIndex || 1;

  return (
    <section id="environment" className="home-e-section py-16 lg:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
              Care Environment
            </p>
            <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-4">
              아이가 편안한 환경,
              <span className="block text-slate-500 font-normal text-xl sm:text-2xl mt-2">
                상담부터 케어까지 한 번에
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              {site.brandName}는 강아지 파양 입소와 무료분양 과정을 한 페이지에서 쉽게
              이해할 수 있도록 안내합니다. 방문 전 상담으로 필요한 내용을 먼저 확인하세요.
            </p>
            <div className="space-y-3">
              {ENV_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="home-e-icon-row rounded-2xl bg-white border border-slate-200 p-4"
                >
                  <span
                    className="home-e-mini-icon"
                    style={{ animationDelay: `${i * 160}ms` }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[base, base + 1, base + 2, base + 3].map((idx, i) => (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-3xl shadow-sm ring-1 ring-slate-200 ${
                  i === 1 ? "mt-8" : i === 2 ? "-mt-4" : ""
                }`}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={getImageUrl(idx, site)}
                    alt={`${site.brandName} 환경 사진 ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition duration-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
