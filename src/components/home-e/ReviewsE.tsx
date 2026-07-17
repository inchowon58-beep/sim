import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function ReviewsE() {
  const { tenantUi } = await getResolvedSiteConfig();
  const reviews = (tenantUi?.reviews || []).slice(0, 3);

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="home-e-section py-16 lg:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Reviews
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900">
            이용 후기
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <blockquote
              key={`${review.name}-${i}`}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
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
