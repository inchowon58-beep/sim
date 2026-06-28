import Link from "next/link";
import { getAllKeywords } from "@/lib/keywords";

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

/**
 * 메인 페이지 (/)
 *
 * 프로덕션: Nginx가 이 경로를 agapetstory.co.kr로 역방향 프록시하는 것을 권장.
 * 이 페이지는 SEO 서브페이지 시스템의 허브 역할만 수행합니다.
 */
export default async function HomePage() {
  const keywords = await getAllKeywords();

  return (
    <main className="home">
      <section className="home-hero">
        <h1>Agapet Story SEO Hub</h1>
        <p>
          메인 콘텐츠는{" "}
          <a href={PROXY_TARGET} rel="noopener noreferrer">
            {PROXY_TARGET}
          </a>
          를 Nginx 역방향 프록시로 노출하도록 구성하세요.
        </p>
        <p className="home-note">
          개발 환경에서 앱 레벨 프록시를 테스트하려면{" "}
          <code>ENABLE_APP_LEVEL_MAIN_PROXY=true</code>를 설정하세요.
        </p>
      </section>

      <section className="home-keywords">
        <h2>활성 키워드 서브페이지</h2>
        {keywords.length === 0 ? (
          <p>등록된 키워드가 없습니다. API로 키워드를 추가하세요.</p>
        ) : (
          <ul>
            {keywords.map((kw) => (
              <li key={kw.id}>
                <Link href={`/${encodeURIComponent(kw.slug)}`}>{kw.title}</Link>
                <span className="slug">/{kw.slug}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
