import { getResolvedSiteConfig } from "@/utils/siteConfig";

const FALLBACK_REVIEWS = [
  {
    name: "김○○",
    business: "파양 입소 상담",
    text: "급하게 이사를 가게 되어 상담을 받았는데, 절차와 비용을 차분히 설명해 주셔서 안심하고 입소할 수 있었습니다.",
    rating: 5,
  },
  {
    name: "이○○",
    business: "입양 매칭",
    text: "보호중인 아이들 사진을 보고 상담 후 매칭했습니다. 아이 성향까지 꼼꼼히 알려주셔서 적응이 빨랐어요.",
    rating: 5,
  },
  {
    name: "박○○",
    business: "방문 픽업",
    text: "센터까지 방문이 어려웠는데 담당자분이 직접 방문 픽업을 안내해 주셔서 정말 큰 도움이 됐습니다.",
    rating: 5,
  },
  {
    name: "최○○",
    business: "입소 후 근황",
    text: "입소 후에도 생활 사진을 공유해 주셔서 마음이 놓였습니다. 책임감 있게 케어해 주시는 느낌이었어요.",
    rating: 5,
  },
  {
    name: "정○○",
    business: "고양이 입양",
    text: "성향과 생활 환경을 자세히 물어보신 뒤 아이를 연결해 주셨습니다. 지금은 집에 잘 적응해서 지내고 있어요.",
    rating: 5,
  },
  {
    name: "한○○",
    business: "강아지 입양",
    text: "처음이라 걱정이 많았는데 상담부터 입양까지 차분히 진행돼 믿음이 갔습니다. 추천합니다.",
    rating: 5,
  },
] as const;

export default async function ReviewsE() {
  const { tenantUi } = await getResolvedSiteConfig();
  const fromTenant = tenantUi?.reviews || [];
  const reviews =
    fromTenant.length >= 6
      ? fromTenant.slice(0, 6)
      : [
          ...fromTenant,
          ...FALLBACK_REVIEWS.filter(
            (fb) => !fromTenant.some((r) => r.name === fb.name && r.text === fb.text)
          ),
        ].slice(0, 6);

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="home-e-section py-16 lg:py-24 bg-[var(--e-surface-warm)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Reviews
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900">이용 후기</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((review, i) => (
            <blockquote
              key={`${review.name}-${i}`}
              className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-[var(--e-accent)]/25 hover:shadow-md transition"
            >
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                &ldquo;{review.text}&rdquo;
              </p>
              <footer>
                <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                <p className="text-xs text-slate-400 mt-1">{review.business}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
