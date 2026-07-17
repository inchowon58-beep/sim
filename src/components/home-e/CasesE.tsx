import Image from "next/image";
import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";
import {
  COM2PET_REVIEWS,
  parseCom2petReviews,
  COM2PET_REVIEW_URL,
  type Com2petReviewItem,
} from "@/lib/com2pet-reviews";
import { readBlobText, isBlobConfigured } from "@/lib/blob-storage";

async function getReviewItems(): Promise<Com2petReviewItem[]> {
  if (isBlobConfigured()) {
    try {
      const raw = await readBlobText("com2pet-adoption.json");
      if (raw) {
        const parsed = JSON.parse(raw) as { reviews?: Com2petReviewItem[] };
        if (parsed.reviews?.length) return parsed.reviews.slice(0, 8);
      }
    } catch {
      /* fallback */
    }
  }

  try {
    const res = await fetch(COM2PET_REVIEW_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AgapetShelterBot/1.0; +https://sim-seven-woad.vercel.app)",
      },
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const html = await res.text();
      const live = parseCom2petReviews(html, 8);
      if (live.length >= 4) {
        // 8개 미만이면 정적 폴백으로 채움
        const merged = [...live];
        for (const fb of COM2PET_REVIEWS) {
          if (merged.length >= 8) break;
          if (!merged.some((x) => x.imageUrl === fb.imageUrl)) merged.push(fb);
        }
        return merged.slice(0, 8);
      }
    }
  } catch {
    /* fallback */
  }

  return COM2PET_REVIEWS.slice(0, 8);
}

export default async function CasesE() {
  const site = await getSiteConfig();
  const items = await getReviewItems();

  return (
    <section id="cases" className="home-e-section py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--e-accent)] mb-3">
            Matching Cases
          </p>
          <h2 className="home-e-display text-2xl sm:text-3xl text-slate-900 mb-3">
            파양·분양 매칭 사례
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {site.brandName}를 통해 새 가족을 만난 아이들의 입양 후기입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="home-e-card group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-900 line-clamp-2">{item.title}</p>
                {item.excerpt && (
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/#contact"
            className="inline-flex text-sm font-semibold text-[var(--e-accent)] hover:underline"
          >
            입양 상담하기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
