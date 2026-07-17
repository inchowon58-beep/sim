import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const DEFAULT_CENTERS = [
  "서울",
  "인천",
  "수원",
  "부천",
  "고양",
  "안양",
  "성남",
  "김포",
] as const;

export default async function CenterNetworkE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const centers = (tenantUi?.regionLinks?.length ? tenantUi.regionLinks : DEFAULT_CENTERS)
    .slice(0, 8)
    .map((label) => label.replace(/강아지파양|강아지무료분양/g, ""));

  return (
    <section id="centers" className="home-e-section py-16 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Local Consultation
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            지역별 강아지 파양·무료분양 상담
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            아이조아식 전국 센터 안내 흐름을 참고해, 한 페이지 안에서 지역 상담 연결까지
            확인할 수 있게 구성했습니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {centers.map((center, i) => (
            <Link
              key={`${center}-${i}`}
              href="/#contact"
              className="home-e-center-card rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:bg-white hover:border-[var(--e-accent)]/30 hover:shadow-lg transition"
            >
              <span
                className="home-e-mini-icon mb-4"
                style={{ animationDelay: `${i * 90}ms` }}
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-semibold text-slate-900 mb-2">
                {center || site.brandName} 상담센터
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                입소 상담 · 무료분양 매칭 · 방문 예약 안내
              </p>
              <span className="text-sm font-semibold text-[var(--e-accent)]">상담하기 →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
