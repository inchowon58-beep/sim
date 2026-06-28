import type { Metadata } from "next";
import { getAllKeywords } from "@/lib/keywords";
import { getAllKeywordGroups } from "@/lib/keyword-groups";
import { KeywordAdminPanel } from "@/components/KeywordAdminPanel";
import { KeywordGroupAdminPanel } from "@/components/KeywordGroupAdminPanel";

/**
 * /admin — 키워드 등록·관리 (검색 노출 제외)
 */
export default async function AdminPage() {
  const [keywords, groups] = await Promise.all([
    getAllKeywords(),
    getAllKeywordGroups(),
  ]);

  return (
    <>
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">dmcmusic.co.kr · 관리자</p>
          <h1>SEO 서브페이지 관리</h1>
        </div>
      </header>

      <div className="admin-info-cards">
        <div className="admin-info-card">
          <strong>메인 /</strong>
          <span>아가펫스토리 표시</span>
        </div>
        <div className="admin-info-card">
          <strong>키워드 URL</strong>
          <span>SEO + 아가펫스토리</span>
        </div>
        <div className="admin-info-card admin-info-card--active">
          <strong>/admin</strong>
          <span>설정 전용 (지금 여기)</span>
        </div>
      </div>

      <KeywordGroupAdminPanel
        initialGroups={groups.map((g) => ({
          id: g.id,
          name: g.name,
          keywords: g.keywords,
        }))}
      />

      <KeywordAdminPanel
        initialKeywords={keywords.map((k) => ({
          id: k.id,
          slug: k.slug,
          title: k.title,
          baseKeyword: k.baseKeyword,
          description: k.description,
        }))}
      />
    </>
  );
}
