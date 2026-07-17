import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function ServicesE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const cards = tenantUi?.serviceCards || [];
  const surrender = cards.filter((c) =>
    /파양|입소|케어|상담|긴급/.test(c.title)
  );
  const adoption = cards.filter((c) => /분양|매칭|입양/.test(c.title));
  const surrenderCards = surrender.length ? surrender : cards.slice(0, 3);
  const adoptionCards = adoption.length ? adoption : cards.slice(3, 6);

  return (
    <>
      <section id="surrender" className="home-e-section py-16 lg:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
              Dog Surrender
            </p>
            <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
              강아지 파양 입소
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              피치 못할 사정으로 더 이상 함께하기 어려울 때, 파양 입소 절차와 비용을
              투명하게 안내합니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {surrenderCards.map((card) => (
              <article
                key={card.title}
                className="home-e-card group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-40">
                  <Image
                    src={getImageUrl(card.imageIndex, site)}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">{card.title}</h3>
                  <p className="text-[11px] tracking-wide uppercase text-slate-400 mb-2">
                    {card.englishLabel}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/#contact"
              className="inline-flex text-sm font-semibold text-[var(--e-accent)] hover:underline"
            >
              파양 입소 상담하기 →
            </Link>
          </div>
        </div>
      </section>

      <section id="adoption" className="home-e-section py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
              Free Adoption
            </p>
            <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
              강아지 무료분양
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              새 가족을 기다리는 아이와 책임 있는 보호자를 연결합니다. 신원 확인과 상담 후
              매칭합니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {adoptionCards.map((card) => (
              <article
                key={card.title}
                className="home-e-card group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative h-40">
                  <Image
                    src={getImageUrl(card.imageIndex, site)}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">{card.title}</h3>
                  <p className="text-[11px] tracking-wide uppercase text-slate-400 mb-2">
                    {card.englishLabel}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
