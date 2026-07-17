import Link from "next/link";
import type { CSSProperties } from "react";

const STEPS = [
  {
    step: "01",
    title: "상담 신청",
    desc: "전화·온라인으로 파양 입소 또는 입양 상담을 신청합니다. 상황과 일정에 맞춰 빠르게 안내합니다.",
    tone: "home-e-quick-orange",
  },
  {
    step: "02",
    title: "센터 방문",
    desc: "사전 예약 후 센터를 방문해 시설과 절차를 확인합니다. 방문이 힘든 경우 담당자가 직접 방문 픽업도 가능합니다.",
    tone: "home-e-quick-blue",
  },
  {
    step: "03",
    title: "입소·비용 안내",
    desc: "입소 비용과 케어 내용을 투명하게 확인한 뒤 입소를 진행합니다. 항목별 안내를 사전에 드립니다.",
    tone: "home-e-quick-purple",
  },
  {
    step: "04",
    title: "새 가족 매칭",
    desc: "보호중인 아이가 새 가족을 만날 때까지 매칭과 사후 상담을 책임지고 지원합니다.",
    tone: "home-e-quick-green",
  },
] as const;

export default function GuideE() {
  return (
    <section id="guide" className="home-e-section py-16 lg:py-24 bg-[var(--e-surface-warm)]">
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

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.step}
              className={`home-e-quick-card ${step.tone}`}
              style={{ "--home-e-icon-delay": `${i * 0.35}s` } as CSSProperties}
            >
              <div className="home-e-quick-head">
                <span className="home-e-quick-icon home-e-quick-step" aria-hidden>
                  {step.step}
                </span>
                <h3 className="home-e-quick-title">{step.title}</h3>
              </div>
              <span className="home-e-quick-more">
                더보기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="home-e-quick-desc">{step.desc}</p>
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
