import { getSiteConfig } from "@/lib/site-config";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const WHY_ICONS = ["🏆", "⚙️", "⏰", "🛡️", "💰"];

export default async function WhyUsB() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.whyUsItems || [];
  const statsGrid = tenantUi?.statsGrid || [];

  return (
    <section id="whyUs" className="home-b-section py-16 lg:py-24 bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2">선택해야 하는 이유</p>
          <h2 className="text-3xl lg:text-4xl font-black">
            왜 <span className="text-orange">{site.brandName}</span>인가요?
          </h2>
          <p className="text-gray-400 mt-3">모든 보호소가 비슷해 보여도, 케어와 매칭의 차이는 현장에서 나타납니다.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {items.map((item, i) => (
            <div key={item.title} className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-2xl block mb-3">{WHY_ICONS[i] || "✓"}</span>
              <h3 className="font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.sub}</p>
            </div>
          ))}
        </div>

        {statsGrid.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {statsGrid.map((stat) => (
              <div key={stat.label} className="text-center py-4 px-2 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xl font-black text-orange">
                  {stat.value}
                  {stat.suffix && <span className="text-sm text-white/70">{stat.suffix}</span>}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
