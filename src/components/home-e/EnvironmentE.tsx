import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";

const ENV_ITEMS = [
  {
    title: "가정과 가까운 생활 공간",
    desc: "입소 후에도 아이가 안정적으로 쉴 수 있도록 공간과 생활 루틴을 관리합니다.",
  },
  {
    title: "일상 케어",
    desc: "산책, 목욕, 식사, 기본 건강 상태 확인까지 꾸준하게 체크합니다.",
  },
  {
    title: "성향 기반 매칭",
    desc: "아이의 성격과 보호자의 생활 환경을 함께 확인해 새 가족 매칭을 진행합니다.",
  },
] as const;

/** 강아지·야외 활동 위주 — 건물만 있는 흐린 컷 대신 생동감 있는 인덱스 */
const HOME_ENV_IMAGES = [2, 4, 5, 7] as const;

const ENV_CAPTIONS = [
  "햇살 가득한 야외 놀이",
  "아이와 함께하는 케어",
  "활기찬 산책·놀이 시간",
  "밝은 표정으로 맞이하는 일상",
] as const;

export default async function EnvironmentE() {
  const site = await getSiteConfig();

  return (
    <section id="environment" className="home-e-section py-16 lg:py-24 bg-[var(--e-surface-warm)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
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
              {site.brandName}는 파양 입소 후에도 아이가 집처럼 편안하게 지낼 수 있도록
              생활 환경을 관리합니다. 방문 전 상담으로 필요한 내용을 먼저 확인하세요.
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

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {HOME_ENV_IMAGES.map((idx, i) => (
              <figure
                key={idx}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={getImageUrl(idx, site)}
                    alt={ENV_CAPTIONS[i]}
                    fill
                    className="home-e-photo object-cover hover:scale-105 transition duration-700"
                    sizes="(max-width: 1024px) 50vw, 28vw"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent px-3 py-3">
                  <span className="text-[11px] sm:text-xs font-medium text-white">
                    {ENV_CAPTIONS[i]}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
