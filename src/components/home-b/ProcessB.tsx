import { getResolvedSiteConfig } from "@/utils/siteConfig";

const STEP_ICONS = ["📞", "📍", "📋", "⚙️", "✅"];

export default async function ProcessB() {
  const { tenantUi } = await getResolvedSiteConfig();
  const keyword = tenantUi?.heroKeyword || "파양·분양";
  const steps = tenantUi?.processSteps || [];

  return (
    <section id="process" className="home-b-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2">상담 절차</p>
          <h2 className="text-3xl lg:text-4xl font-black text-dark">
            {keyword} <span className="text-orange">5단계</span> 프로세스
          </h2>
          <p className="text-gray-600 mt-3">입소부터 새 가족 매칭까지, 체계적인 절차로 안내합니다.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className="home-b-card text-center p-5 rounded-2xl border border-gray-100 bg-gray-50/30 hover:border-orange/30 transition"
            >
              <p className="text-xs font-bold text-orange mb-2">{step.step}</p>
              <span className="text-2xl block mb-3">{STEP_ICONS[i] || "✓"}</span>
              <h3 className="font-bold text-dark mb-2">{step.title}</h3>
              <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
