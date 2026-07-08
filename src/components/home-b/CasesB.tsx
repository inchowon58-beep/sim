import Image from "next/image";
import { CONSTRUCTION_CASES } from "@/lib/cases";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function CasesB() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.casesItems?.length ? tenantUi.casesItems : CONSTRUCTION_CASES;
  const display = items.slice(0, 8);

  return (
    <section id="cases" className="home-b-section py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2">파양·분양 사례</p>
          <h2 className="text-3xl lg:text-4xl font-black text-dark">
            3,200건+ <span className="text-orange">매칭 사례</span>
          </h2>
          <p className="text-gray-600 mt-3">파양 입소·무료분양·입양 매칭 사례를 확인해 보세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {display.map((item) => (
            <article key={item.id} className="home-b-card rounded-2xl overflow-hidden bg-white shadow-sm group">
              <div className="relative h-36 sm:h-44">
                <Image
                  src={getImageUrl(item.imageIndex, site)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
