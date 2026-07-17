import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "상담 신청",
    desc: "전화·온라인으로 파양 입소 또는 입양 상담을 신청합니다.",
  },
  {
    step: "02",
    title: "센터 방문",
    desc: "사전 예약 후 센터를 방문해 아이와 절차를 확인합니다. 방문이 힘든 경우 담당자가 직접 방문 픽업도 가능합니다.",
  },
  {
    step: "03",
    title: "입소·비용 안내",
    desc: "입소 비용과 케어 내용을 투명하게 안내한 뒤 입소를 진행합니다.",
  },
  {
    step: "04",
    title: "새 가족 매칭",
    desc: "보호중인 아이와 책임 있는 보호자를 연결하고 사후 상담을 지원합니다.",
  },
] as const;

export default function GuideE() {
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
            파양 입소부터 새 가족 매칭까지, 4단계로 안내합니다.
          </p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.step}
              className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm"
            >
              <span
                className="home-e-mini-icon mb-4"
                style={{ animationDelay: `${i * 100}ms` }}
                aria-hidden
              >
                {step.step}
              </span>
              <h3 className="font-semibold text-slate-900 text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
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
