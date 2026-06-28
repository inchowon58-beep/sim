import type { KeywordEntry, SeoMeta } from "@/types/keyword";

interface SeoSubpageLayoutProps {
  entry: KeywordEntry;
  seo: SeoMeta;
  contentHtml: string;
  heroImageUrl?: string | null;
}

/**
 * 서브페이지 HTML 렌더링.
 * Next.js Metadata API가 head 태그(Title, OG, Canonical)를 처리하고,
 * 이 컴포넌트는 본문 + JSON-LD 구조화 데이터를 담당합니다.
 */
export function SeoSubpageLayout({
  entry,
  seo,
  contentHtml,
  heroImageUrl,
}: SeoSubpageLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: seo.canonical,
    ...(seo.ogImage || heroImageUrl
      ? { image: seo.ogImage ?? heroImageUrl }
      : {}),
    keywords: entry.tags?.join(", "),
  };

  return (
    <article className="subpage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="subpage-header">
        <p className="subpage-breadcrumb">
          <a href="/">홈</a>
          <span aria-hidden="true"> / </span>
          <span>{entry.baseKeyword}</span>
        </p>
        {entry.suffix && (
          <p className="subpage-variant">변형 페이지 ({entry.suffix})</p>
        )}
        {entry.useContentMixer !== false && (
          <p className="subpage-mixed-badge">가변 콘텐츠 (Mixer)</p>
        )}
      </header>

      <div
        className="subpage-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <footer className="subpage-footer">
        <p className="subpage-canonical">
          Canonical: <code>{seo.canonical}</code>
        </p>
      </footer>
    </article>
  );
}
