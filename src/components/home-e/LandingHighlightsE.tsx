import Link from "next/link";

const QUICK_LINKS = [
  {
    href: "/#about",
    icon: "M12 3.5 20 8v8.5l-8 4-8-4V8l8-4.5Zm0 2.8L6.5 9.4 12 12.3l5.5-2.9L12 6.3Zm-5.8 5.4v3.8l4.5 2.2v-3.8l-4.5-2.2Zm7.1 6 4.5-2.2v-3.8l-4.5 2.2v3.8Z",
    title: "센터 소개",
    desc: "파양 입소부터 새 가족 매칭까지, 전문 상담과 방문 예약 안내를 한곳에서 확인하세요.",
    tone: "home-e-card-orange",
  },
  {
    href: "/#surrender",
    icon: "M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Zm1.2 6.7 2.7 2.7 5.9-6.1 1.4 1.4-7.3 7.5-4.1-4.1 1.4-1.4Z",
    title: "파양 입소",
    desc: "이민·이사·군입대 등 피치 못한 사정의 파양 입소 절차와 비용을 투명하게 안내합니다.",
    tone: "home-e-card-blue",
  },
  {
    href: "/#protected",
    icon: "M12 21s-7-4.4-7-10.1C5 7.6 7.3 5 10.1 5c1.2 0 2.1.5 2.9 1.4.8-.9 1.7-1.4 2.9-1.4C18.7 5 21 7.6 21 10.9 21 16.6 12 21 12 21Z",
    title: "보호중인 아이들",
    desc: "파양으로 입소한 아이들이 새 가족을 기다리고 있습니다. 상담 후 매칭을 진행합니다.",
    tone: "home-e-card-violet",
  },
  {
    href: "/#cases",
    icon: "M7 5h10v2H7V5Zm-2 4h14v2H5V9Zm2 4h10v2H7v-2Zm-2 4h14v2H5v-2Z",
    title: "매칭 사례",
    desc: "새 가족을 만난 아이들의 입양 후기와 매칭 스토리를 먼저 확인해 보세요.",
    tone: "home-e-card-lime",
  },
] as const;

const NOTICES = [
  "강아지 파양 입소는 사전 상담 후 방문 예약제로 진행됩니다.",
  "센터 방문이 어려운 경우 담당자 방문 픽업도 안내합니다.",
  "보호중인 아이들은 상담 후 새 가족 매칭을 진행합니다.",
] as const;

export default function LandingHighlightsE() {
  return (
    <section className="home-e-section py-12 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-orange-200/70 bg-[var(--e-surface-warm)] p-4 sm:p-5 mb-8 overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="home-e-pulse-dot shrink-0" aria-hidden />
            <p className="text-xs sm:text-sm font-semibold text-slate-900 shrink-0">공지사항</p>
            <div className="home-e-notice-mask flex-1 overflow-hidden">
              <div className="home-e-notice-track flex gap-8 whitespace-nowrap text-xs sm:text-sm text-slate-600">
                {[...NOTICES, ...NOTICES].map((notice, i) => (
                  <span key={`${notice}-${i}`}>{notice}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {QUICK_LINKS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`home-e-fill-card group ${item.tone}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="home-e-fill-icon" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.icon} />
                  </svg>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-slate-800/70 group-hover:text-slate-900 transition">
                바로가기 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
