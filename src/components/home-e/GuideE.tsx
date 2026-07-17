import Link from "next/link";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const DEFAULT_GUIDE = [
  {
    title: "파양 입소 절차",
    subtitle: "Surrender Process",
    description:
      "전화·온라인 상담 후 센터 방문, 입소 비용 확인, 건강검진과 함께 입소가 진행됩니다.",
  },
  {
    title: "입소 비용 안내",
    subtitle: "Intake Fee",
    description:
      "사설 센터 운영에는 관리 비용이 발생합니다. 항목별 입소 비용을 사전에 투명하게 안내합니다.",
  },
  {
    title: "무료분양·입양",
    subtitle: "Free Adoption",
    description:
      "파양견의 무료분양·입양 절차입니다. 신원 확인과 심층 상담 후 매칭합니다.",
  },
  {
    title: "이럴 때 상담하세요",
    subtitle: "When to Call",
    description:
      "이민, 이사, 군입대, 임신·출산, 알러지 등 더 이상 함께하기 어려울 때 문의해 주세요.",
  },
];

export default async function GuideE() {
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.guideItems?.length ? tenantUi.guideItems : DEFAULT_GUIDE;
  const steps = tenantUi?.processSteps?.slice(0, 4);

  return (
    <section id="guide" className="home-e-section py-16 lg:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Guide
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            입소·분양 안내
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            파양 입소부터 무료분양까지, 필요한 정보를 한눈에 확인하세요.
          </p>
        </div>

        {steps && steps.length > 0 && (
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {steps.map((step) => (
              <li
                key={step.step}
                className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
              >
                <span className="text-xs font-bold text-[var(--e-accent)]">{step.step}</span>
                <h3 className="mt-2 font-semibold text-slate-900 text-sm">{step.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </li>
            ))}
          </ol>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((item) => (
            <article
              key={item.title}
              className="home-e-card rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:border-[var(--e-accent)]/30 transition"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.title}</h3>
              <p className="text-[11px] tracking-wide uppercase text-slate-400 mb-3">
                {item.subtitle}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.description}</p>
              <Link
                href="/#contact"
                className="text-sm font-semibold text-[var(--e-accent)] hover:underline"
              >
                상담 문의 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
