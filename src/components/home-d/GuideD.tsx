import Link from "next/link";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

const DEFAULT_GUIDE = [
  {
    title: "파양·입소 절차 안내",
    subtitle: "Intake Process Guide",
    description:
      "상담부터 센터 방문, 입소 비용 확인, 건강검진·케어, 분양·입양 매칭까지 안내합니다.",
  },
  {
    title: "입소 비용 안내",
    subtitle: "Intake Fee Guide",
    description:
      "모든 사설 보호소에는 관리 비용이 발생합니다. 항목별 입소 비용을 투명하게 안내합니다.",
  },
  {
    title: "무료분양·입양 안내",
    subtitle: "Adoption Guide",
    description:
      "파양견·파양묘의 무료분양·무료입양 절차. 신원 확인과 심층 상담 후 매칭합니다.",
  },
  {
    title: "이럴 때 파양·분양",
    subtitle: "When to Visit",
    description:
      "이민, 이사, 군입대, 임신·출산, 알러지 등 더 이상 함께하기 어려울 때 상담하세요.",
  },
];

export default async function GuideD() {
  const { tenantUi } = await getResolvedSiteConfig();
  const items = tenantUi?.guideItems?.length ? tenantUi.guideItems : DEFAULT_GUIDE;

  return (
    <section id="guide" className="home-d-section py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3 text-center">
          Service Information
        </p>
        <h2 className="home-d-display text-2xl sm:text-3xl lg:text-4xl text-center text-gray-900 mb-12">
          Pet Care <em className="italic text-orange font-normal">Guide</em>
        </h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <article
              key={item.title}
              className="home-d-card bg-white border border-gray-100 rounded-sm p-6 lg:p-8 hover:border-orange/30 transition"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-4">
                {item.subtitle}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{item.description}</p>
              <Link
                href="/#contact"
                className="text-sm font-medium text-gray-900 hover:text-orange transition"
              >
                자세히 보기 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
