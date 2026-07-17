"use client";

import { useMemo } from "react";
import { useTenantUi } from "@/components/SiteConfigProvider";
import { parseFooterKeywords } from "@/lib/footer-keywords";

interface Props {
  /** dark 푸터용 밝은 톤 */
  tone?: "dark" | "light";
}

/**
 * 사이트에 등록된 하단 키워드를 접기/펼치기(`details`)로 표시.
 * 비어 있으면 렌더하지 않음. 키워드는 DOM에 포함되며 사용자가 펼쳐 볼 수 있음.
 */
export default function FooterKeywordAccordion({ tone = "dark" }: Props) {
  const tenantUi = useTenantUi();
  const keywords = useMemo(
    () => parseFooterKeywords(tenantUi?.footerKeywords),
    [tenantUi?.footerKeywords]
  );

  if (keywords.length === 0) return null;

  const isDark = tone === "dark";
  const summaryClass = isDark
    ? "text-gray-500 hover:text-gray-300"
    : "text-gray-400 hover:text-gray-600";
  const panelClass = isDark
    ? "border-gray-800 text-gray-500"
    : "border-gray-100 text-gray-500";
  const chipClass = isDark
    ? "border-gray-700 bg-white/5 text-gray-400"
    : "border-gray-200 bg-gray-50 text-gray-600";

  return (
    <details className="mt-8 pt-6 border-t border-white/10 group">
      <summary
        className={`inline-flex cursor-pointer list-none items-center gap-1.5 text-xs transition ${summaryClass} [&::-webkit-details-marker]:hidden`}
      >
        <span>관련 지역·키워드 안내</span>
        <span className="text-[10px] transition group-open:rotate-180" aria-hidden>
          ▼
        </span>
        <span className="opacity-70">({keywords.length})</span>
      </summary>

      <div className={`mt-3 pt-3 border-t ${panelClass}`}>
        <p className="text-[11px] mb-3 opacity-80">
          이 지역과 관련된 안내 키워드입니다.
        </p>
        <ul className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {keywords.map((keyword) => (
            <li key={keyword}>
              <span
                className={`inline-block max-w-[220px] truncate px-2.5 py-1 rounded-md border text-[11px] ${chipClass}`}
                title={keyword}
              >
                {keyword}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
