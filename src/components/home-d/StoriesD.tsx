import Image from "next/image";
import { CONSTRUCTION_CASES } from "@/lib/cases";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function StoriesD() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.casesItems?.length ? tenantUi.casesItems : CONSTRUCTION_CASES;
  const featured = items.slice(0, 4);

  return (
    <section id="stories" className="home-d-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 text-center">
          Project Stories
        </p>
        <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl text-center text-gray-900 mb-4">
          지난 파양·분양 <em className="italic text-orange font-normal">매칭 사례</em>
        </h2>
        <p className="text-center text-gray-500 text-sm max-w-2xl mx-auto mb-12 leading-relaxed">
          {site.brandName}를 통해 새 가족을 만난 아이들의 사례를 먼저 확인해 보세요.
          책임 있는 입소 케어와 매칭이 기다리고 있습니다.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((item) => (
            <article key={item.id} className="home-d-card group overflow-hidden rounded-sm">
              <div className="relative aspect-[4/3]">
                <Image
                  src={getImageUrl(item.imageIndex, site)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4 border border-t-0 border-gray-100">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{item.type}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
