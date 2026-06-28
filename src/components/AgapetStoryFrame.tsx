const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

interface AgapetStoryFrameProps {
  /** iframe title (접근성) */
  title?: string;
}

/**
 * 서브페이지 본문 — 아가펫스토리 공식 사이트 전체를 표시
 * SEO 메타(Title, OG, Canonical)는 page.tsx generateMetadata에서 키워드별 처리
 */
export function AgapetStoryFrame({
  title = "아가펫스토리",
}: AgapetStoryFrameProps) {
  return (
    <iframe
      src={PROXY_TARGET}
      className="agapet-frame"
      title={title}
      loading="eager"
    />
  );
}
