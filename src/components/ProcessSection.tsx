import { PROCESS_STEPS } from "@/lib/cases";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function ProcessSection() {
  const { tenantUi } = await getResolvedSiteConfig();
  const steps = tenantUi?.processSteps?.length ? tenantUi.processSteps : PROCESS_STEPS;

  return (
    <section id="process" className="py-16 lg:py-24 bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            파양·분양 <span className="text-orange">상담 절차</span>
          </h2>
          <p className="text-gray-400">입소부터 새 가족 매칭까지 책임지고 안내합니다</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-orange/30" />
              )}
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange flex items-center justify-center text-xl font-black">
                {step.step}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 whitespace-pre-line">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
