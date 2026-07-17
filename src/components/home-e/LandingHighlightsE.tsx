import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

function IconHome() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 10.8 12 4.5l7.5 6.3V19a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.2h-3.6V20.5H6A1.5 1.5 0 0 1 4.5 19v-8.2Z"
        fill="currentColor"
      />
      <path
        d="M9.2 11.4h5.6c.4 0 .7.3.7.7v1.1H8.5v-1.1c0-.4.3-.7.7-.7Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.2 3.8h7.6c.9 0 1.6.7 1.6 1.6v13.2c0 .9-.7 1.6-1.6 1.6H8.2c-.9 0-1.6-.7-1.6-1.6V5.4c0-.9.7-1.6 1.6-1.6Z"
        fill="currentColor"
      />
      <path
        d="M9.4 2.8h5.2c.5 0 .9.4.9.9v1.1H8.5V3.7c0-.5.4-.9.9-.9Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M9.6 10.2h4.8v1.4H9.6v-1.4Zm0 3.2h4.8v1.4H9.6v-1.4Z"
        fill="#fff"
      />
      <path
        d="m10.1 16.8 1.5 1.5 3.4-3.5-.9-.9-2.5 2.5-.6-.6-.9.9Z"
        fill="#fff"
      />
    </svg>
  );
}

function IconPaw() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="8.2" cy="8.1" rx="1.7" ry="2.1" fill="currentColor" />
      <ellipse cx="15.8" cy="8.1" rx="1.7" ry="2.1" fill="currentColor" />
      <ellipse cx="5.9" cy="12.2" rx="1.55" ry="1.9" fill="currentColor" />
      <ellipse cx="18.1" cy="12.2" rx="1.55" ry="1.9" fill="currentColor" />
      <path
        d="M12 11.2c2.8 0 4.8 2.1 4.8 4.4 0 1.7-1.3 2.8-2.6 2.8-.8 0-1.4-.3-2.2-.9-.8.6-1.4.9-2.2.9-1.3 0-2.6-1.1-2.6-2.8 0-2.3 2-4.4 4.8-4.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.4 14.2 9h5.9l-4.8 3.6 1.8 5.7L12 15.2 6.9 18.3l1.8-5.7L3.9 9h5.9L12 3.4Z"
        fill="currentColor"
      />
      <circle cx="12" cy="11.2" r="1.35" fill="#fff" opacity="0.9" />
    </svg>
  );
}

const QUICK_LINKS: {
  href: string;
  title: string;
  desc: string;
  tone: string;
  icon: ReactNode;
}[] = [
  {
    href: "/#about",
    title: "센터 소개",
    desc: "파양 입소부터 새 가족 매칭까지, 전문 상담과 방문 예약 안내를 한곳에서 확인하세요.",
    tone: "home-e-quick-orange",
    icon: <IconHome />,
  },
  {
    href: "/#surrender",
    title: "파양 입소",
    desc: "이민·이사·군입대 등 피치 못한 사정의 파양 입소 절차와 비용을 투명하게 안내합니다.",
    tone: "home-e-quick-blue",
    icon: <IconClipboard />,
  },
  {
    href: "/#protected",
    title: "보호중인 아이들",
    desc: "파양으로 입소한 아이들이 새 가족을 기다리고 있습니다. 상담 후 매칭을 진행합니다.",
    tone: "home-e-quick-green",
    icon: <IconPaw />,
  },
  {
    href: "/#cases",
    title: "매칭 사례",
    desc: "새 가족을 만난 아이들의 입양 후기와 매칭 스토리를 먼저 확인해 보세요.",
    tone: "home-e-quick-purple",
    icon: <IconStar />,
  },
];

const NOTICES = [
  "강아지 파양 입소는 사전 상담 후 방문 예약제로 진행됩니다.",
  "센터 방문이 어려운 경우 담당자 방문 픽업도 안내합니다.",
  "보호중인 아이들은 상담 후 새 가족 매칭을 진행합니다.",
] as const;

export default function LandingHighlightsE() {
  return (
    <section className="home-e-section py-12 lg:py-16 bg-[var(--e-surface)]">
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
              className={`home-e-quick-card group ${item.tone}`}
              style={{ "--home-e-icon-delay": `${i * 0.35}s` } as CSSProperties}
            >
              <span className="home-e-quick-icon" aria-hidden>
                {item.icon}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight mt-4 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed text-center flex-1">{item.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
