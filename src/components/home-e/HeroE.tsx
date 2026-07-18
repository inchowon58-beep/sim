import { getSiteConfig } from "@/lib/site-config";
import { getImageUrl } from "@/lib/site-images";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

/** 무료 스톡 영상 (Pexels, 상업적 이용·출처표기 불필요) */
const HERO_VIDEO_SRC = "/videos/hero-dog.mp4";

export default async function HeroE() {
  const site = await getSiteConfig();
  const { tenantUi } = await getResolvedSiteConfig();
  const poster = getImageUrl(tenantUi?.heroImageIndex || 5, site);

  return (
    <section className="home-e-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <video
          className="home-e-hero-video h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="home-e-hero-scrim absolute inset-0" aria-hidden />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-24 lg:pt-36 lg:pb-32 min-h-[78vh] flex items-center">
        <div className="home-e-hero-copy">
          <p className="home-e-hero-eyebrow">
            파양·무료분양 상담 · {site.brandName}
          </p>
          <h1 className="home-e-hero-slogan">
            <span className="home-e-hero-slogan-line">이별 뒤에도 좋은 인연은</span>
            <br />
            <span className="home-e-hero-slogan-accent">이어집니다.</span>
          </h1>
          <p className="home-e-hero-lead">
            <span className="home-e-hero-lead-main">
              {site.brandName}는 오늘도 파양 입소와 새 가족 매칭의 자리를 지킵니다.
            </span>
            <span className="home-e-hero-lead-sub">힘든 결정, 혼자 두지 마세요.</span>
          </p>
          <a href="/#protected" className="home-e-hero-link">
            ↘ 보호중인 아이들
          </a>
        </div>
      </div>
    </section>
  );
}
