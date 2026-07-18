import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const NEWS_CARDS = [
  {
    title: "강아지 파양 입소",
    tag: "입소 안내",
    description:
      "이민·이사·군입대·알러지 등 피치 못한 사정의 가정견 파양 입소를 상담합니다. 절차와 비용을 사전에 투명하게 안내합니다.",
  },
  {
    title: "입소 후 케어",
    tag: "생활·건강",
    description:
      "입소 후 목욕·산책·건강 상태 확인 등 아이 중심의 케어를 진행합니다. 생활 사진과 근황도 공유합니다.",
  },
  {
    title: "긴급·방문 상담",
    tag: "빠른 안내",
    description:
      "출국·이사 등 급한 상황도 신속히 상담합니다. 센터 방문이 어려운 경우 담당자 방문 픽업도 안내합니다.",
  },
] as const;

export default async function ServicesE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const cards = tenantUi?.serviceCards || [];
  const images = NEWS_CARDS.map((_, i) => {
    const fromCards = cards[i]?.imageIndex;
    return typeof fromCards === "number" ? fromCards : i + 1;
  });

  return (
    <section id="surrender" className="home-e-section py-16 lg:py-24 bg-[var(--e-surface-warm)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Dog Surrender
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            강아지 파양 입소
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            더 이상 함께하기 어려울 때, 파양 입소부터 새 가족 매칭까지 한눈에 확인하세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {NEWS_CARDS.map((card, i) => (
            <article
              key={card.title}
              className="home-e-card group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative h-44">
                <Image
                  src={getImageUrl(images[i], site)}
                  alt={card.title}
                  fill
                  className="home-e-photo object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[var(--e-accent)] shadow-sm">
                  {card.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 mb-2 text-base">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
