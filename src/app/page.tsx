import type { Metadata } from "next";
import { getAllKeywords } from "@/lib/keywords";
import { KeywordAdminPanel } from "@/components/KeywordAdminPanel";

export const metadata: Metadata = {
  title: "SEO 서브페이지 관리",
  description: "키워드 등록 및 서브페이지 설정",
  robots: { index: false, follow: false },
};

/**
 * 메인 (/) — 관리 전용
 * 키워드 등록·목록 확인. 아가펫스토리 콘텐츠는 서브페이지에서만 노출.
 */
export default async function AdminHomePage() {
  const keywords = await getAllKeywords();

  return (
    <main className="home admin-home">
      <header className="admin-header">
        <h1>SEO 서브페이지 관리</h1>
        <p>
          이 페이지는 <strong>설정·키워드 등록</strong> 전용입니다.
          생성된 서브페이지는 서버가 아가펫스토리 HTML을 프록시하며, 각
          URL마다 키워드별 SEO가 head에 주입됩니다.
        </p>
      </header>

      <KeywordAdminPanel
        initialKeywords={keywords.map((k) => ({
          id: k.id,
          slug: k.slug,
          title: k.title,
          baseKeyword: k.baseKeyword,
        }))}
      />
    </main>
  );
}
