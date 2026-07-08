import { getResolvedSiteConfig } from "@/utils/siteConfig";

export default async function TopMarqueeB() {
  const { tenantUi } = await getResolvedSiteConfig();
  const lines =
    tenantUi?.marqueeLines?.length
      ? tenantUi.marqueeLines
      : [
          "강아지·고양이 파양·무료분양 전문",
          "365일 상담 접수",
          "투명한 입소 비용 · 책임 있는 매칭",
        ];

  const text = lines.join("  ·  ");

  return (
    <div className="home-b-marquee bg-dark text-white text-xs sm:text-sm py-2 overflow-hidden">
      <div className="home-b-marquee-track whitespace-nowrap font-medium">
        <span>{text}</span>
        <span aria-hidden>{text}</span>
      </div>
    </div>
  );
}
