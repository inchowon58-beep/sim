import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "상담 신청",
    desc: "전화·온라인으로 파양 입소 또는 입양 상담을 신청합니다. 상황과 일정에 맞춰 빠르게 안내합니다.",
    tone: "home-e-card-teal",
  },
  {
    step: "02",
    title: "센터 방문",
    desc: "사전 예약 후 센터를 방문해 시설과 절차를 확인합니다. 방문이 힘든 경우 담당자가 직접 방문 픽업도 가능합니다.",
    tone: "home-e-card-sand",
  },
  {
    step: "03",
    title: "입소·비용 안내",
    desc: "입소 비용과 케어 내용을 투명하게 확인한 뒤 입소를 진행합니다. 항목별 안내를 사전에 드립니다.",
    tone: "home-e-card-sky",
  },
  {
    step: "04",
    title: "새 가족 매칭",
    desc: "보호중인 아이가 새 가족을 만날 때까지 매칭과 사후 상담을 책임지고 지원합니다.",
    tone: "home-e-card-coral",
  },
] as const;

export default function GuideE() {
  return (
    <section id="guide" className="home-e-section py-16 lg:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Guide
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            입소·분양 안내
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            파양 입소부터 새 가족 매칭까지, 4단계로 안내합니다.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((step) => (
            <li key={step.step} className={`home-e-fill-card ${step.tone}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="home-e-fill-icon font-extrabold text-sm tabular-nums" aria-hidden>
                  {step.step}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <Link
            href="/#contact"
            className="inline-flex text-sm font-semibold text-[var(--e-accent)] hover:underline"
          >
            상담 문의하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
