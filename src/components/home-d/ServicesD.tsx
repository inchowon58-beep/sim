import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function ServicesD() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const cards = tenantUi?.serviceCards || [];

  return (
    <section id="services" className="home-d-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 text-center">
          Our Services
        </p>
        <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl text-center text-gray-900 mb-4">
          Service <em className="italic text-orange font-normal">Overview</em>
        </h2>
        <p className="text-center text-gray-500 text-sm max-w-xl mx-auto mb-12">
          당신에게 딱 맞는 {tenantUi?.heroKeyword || "파양·무료분양"} 서비스를 경험해 보세요.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className="home-d-card group border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-44 sm:h-48">
                <Image
                  src={getImageUrl(card.imageIndex, site)}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-3">
                  {card.englishLabel}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
