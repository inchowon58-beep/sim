import Image from "next/image";
import { CONSTRUCTION_CASES } from "@/lib/cases";
import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function CasesE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.casesItems?.length ? tenantUi.casesItems : CONSTRUCTION_CASES;
  const featured = items.slice(0, 6);
  const stats = tenantUi?.stats?.slice(0, 4) || [];

  return (
    <section id="cases" className="home-e-section py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Matching Cases
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            파양·분양 매칭 사례
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {site.brandName}를 통해 새 가족을 만난 아이들의 사례입니다.
          </p>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-5 text-center"
              >
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  {s.value}
                  <span className="text-base text-[var(--e-accent)]">{s.suffix}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item) => (
            <article
              key={item.id}
              className="home-e-card group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={getImageUrl(item.imageIndex, site)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-400 mt-1">{item.type}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
