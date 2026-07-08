import { getResolvedSiteConfig } from "@/utils/siteConfig";

const REVIEW_ICONS = ["🏪", "🎓", "🍽️", "🏢"];

export default async function ReviewsB() {
  const { tenantUi } = await getResolvedSiteConfig();
  const reviews = tenantUi?.reviews || [];

  return (
    <section id="reviews" className="home-b-section py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-orange mb-2">고객 후기</p>
          <h2 className="text-3xl lg:text-4xl font-black text-dark">
            직접 경험한 <span className="text-orange">실제 후기</span>
          </h2>
          <p className="text-gray-600 mt-3">입소·분양 후 작성된 솔직한 후기입니다.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((review, i) => (
            <article
              key={`${review.name}-${i}`}
              className="home-b-card p-6 rounded-2xl border border-gray-100 bg-gray-50/40 hover:shadow-md transition"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">{REVIEW_ICONS[i % REVIEW_ICONS.length]}</span>
                <div>
                  <p className="text-orange text-sm tracking-wider">★★★★★</p>
                  <p className="text-xs text-gray-500 mt-1">파양·분양</p>
                </div>
              </div>
              <h3 className="font-bold text-dark mb-2">&ldquo;{review.text.slice(0, 40)}…&rdquo;</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.text}</p>
              <p className="text-xs text-gray-400">
                {review.business} {review.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
