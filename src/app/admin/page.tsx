import type { Metadata } from "next";
import { getAllKeywords } from "@/lib/keywords";
import { KeywordAdminPanel } from "@/components/KeywordAdminPanel";

export const metadata: Metadata = {
  title: "SEO 서브페이지 관리",
  description: "키워드 등록 및 서브페이지 설정",
  robots: { index: false, follow: false },
};

/**
 * /admin — 키워드 등록·관리 (검색 노출 제외)
 * 메인(/)은 아가펫스토리 프록시, 키워드 URL은 SEO + 아가펫스토리
 */
export default async function AdminPage() {
  const keywords = await getAllKeywords();

  return (
    <main className="home admin-home">
      <header className="admin-header">
        <h1>SEO 서브페이지 관리</h1>
        <p>
          <strong>메인(/)·일반 경로</strong> → 아가펫스토리 ·{" "}
          <strong>키워드 URL</strong> → SEO 메타 + 아가펫스토리 ·{" "}
          <strong>이 페이지</strong> → 설정 전용
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
