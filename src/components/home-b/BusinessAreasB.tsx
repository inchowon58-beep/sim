import Image from "next/image";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function BusinessAreasB() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const keyword = tenantUi?.heroKeyword || "파양·무료분양";
  const areas = tenantUi?.businessAreas || [];

  return (
    <section id="business" className="home-b-section py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2">사업 영역</p>
          <h2 className="text-3xl lg:text-4xl font-black text-dark">
            {keyword}, <span className="text-orange">한곳에서</span> 진행합니다
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            강아지·고양이 파양 입소부터 무료분양·입양 매칭, 입소 후 케어까지 전문적으로 안내합니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {areas.map((area) => (
            <article
              key={area.title}
              className="home-b-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={getImageUrl(area.imageIndex, site)}
                  alt={area.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-dark mb-2">{area.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">{area.description}</p>
                <div className="flex flex-wrap gap-1">
                  {area.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-orange/10 text-orange font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
