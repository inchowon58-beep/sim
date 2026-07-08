import { getSiteConfig } from "@/lib/site-config";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function AboutB() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const keyword = tenantUi?.heroKeyword || "파양·무료분양";
  const features = tenantUi?.aboutFeatures || [];

  return (
    <section id="about" className="home-b-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-sm font-semibold text-orange mb-2">회사소개</p>
            <h2 className="text-3xl lg:text-4xl font-black text-dark leading-tight mb-6">
              믿을 수 있는 <span className="text-orange">{keyword}</span> 센터
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <strong className="text-dark">{site.brandName}</strong>
              {tenantUi?.aboutText
                ? ` — ${tenantUi.aboutText}`
                : `는 파양견·파양묘 입소부터 무료분양·입양 매칭, 입소 후 케어까지 책임지고 진행합니다.`}
            </p>
          </div>
          <div className="grid sm:grid-cols-1 gap-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="home-b-card p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-orange/20 transition"
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
