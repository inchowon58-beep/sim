"use client";

import { useFooterKeywordLinks } from "@/components/SiteConfigProvider";
import type { FooterKeywordLink } from "@/lib/footer-keywords";

interface Props {
  links?: FooterKeywordLink[];
  /** dark 푸터용 밝은 톤 */
  tone?: "dark" | "light";
}

/**
 * 하단 키워드를 접기/펼치기 + 실제 <a> 링크 메뉴로 표시.
 * links가 비어 있으면 미표시.
 */
export default function FooterKeywordAccordion({
  links: linksProp,
  tone = "dark",
}: Props) {
  const contextLinks = useFooterKeywordLinks();
  const links = linksProp ?? contextLinks;

  if (!links.length) return null;

  const isDark = tone === "dark";
  const summaryClass = isDark
    ? "text-gray-500 hover:text-gray-300"
    : "text-gray-400 hover:text-gray-600";
  const panelClass = isDark
    ? "border-gray-800 text-gray-500"
    : "border-gray-100 text-gray-500";
  const linkClass = isDark
    ? "text-gray-400 hover:text-orange border-gray-700 hover:border-orange/50"
    : "text-gray-600 hover:text-orange border-gray-200 hover:border-orange";
  const sepClass = isDark ? "text-gray-700" : "text-gray-300";

  return (
    <details className="mt-8 pt-6 border-t border-white/10 group">
      <summary
        className={`inline-flex cursor-pointer list-none items-center gap-1.5 text-xs transition ${summaryClass} [&::-webkit-details-marker]:hidden`}
      >
        <span>관련 지역·키워드 안내</span>
        <span className="text-[10px] transition group-open:rotate-180" aria-hidden>
          ▼
        </span>
        <span className="opacity-70">({links.length})</span>
      </summary>

      <div className={`mt-3 pt-3 border-t ${panelClass}`}>
        <p className="text-[11px] mb-3 opacity-80 leading-relaxed">
          지역별 파양·무료분양 안내 바로가기입니다. 해당 페이지가 있으면 상세로,
          없으면 상담 신청으로 이동합니다.
        </p>
        <nav aria-label="관련 지역 키워드 바로가기">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-2 max-h-56 overflow-y-auto pr-1 text-[11px] leading-relaxed">
            {links.map((item, index) => (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                {index > 0 && (
                  <span className={`${sepClass} select-none`} aria-hidden>
                    |
                  </span>
                )}
                <a
                  href={item.href}
                  className={`inline-block max-w-[240px] truncate px-1.5 py-0.5 rounded border transition underline-offset-2 hover:underline ${linkClass}`}
                  title={
                    item.hasPage
                      ? `${item.label} 상세 안내`
                      : `${item.label} 상담 신청`
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </details>
  );
}
