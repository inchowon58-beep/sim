"use client";

import { useState } from "react";

interface KeywordItem {
  id: string;
  slug: string;
  title: string;
  baseKeyword: string;
  description?: string;
}

interface KeywordAdminPanelProps {
  initialKeywords: KeywordItem[];
}

export function KeywordAdminPanel({ initialKeywords }: KeywordAdminPanelProps) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [baseKeyword, setBaseKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCreated, setLastCreated] = useState<{
    title: string;
    description: string;
    matchedGroup?: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setLastCreated(null);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseKeyword,
          useContentMixer: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록 실패");

      setKeywords((prev) => [...prev, data.entry]);
      setLastCreated({
        title: data.entry.title,
        description: data.entry.description,
        matchedGroup: data.matchedGroup,
      });
      setMessage(
        `등록 완료: /${data.entry.slug}` +
          (data.indexNow?.status
            ? ` (IndexNow: ${data.indexNow.status})`
            : "")
      );
      setBaseKeyword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록 중 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-panel">
      <section className="admin-section">
        <h2>키워드 등록</h2>
        <p className="admin-desc">
          키워드만 입력하면 <strong>Title</strong>, <strong>Description</strong>
          (키워드 그룹 매칭 시 그룹 기준, 없으면 자동 연관 키워드),{" "}
          <strong>하단 SEO 본문</strong>이 생성됩니다.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            키워드 <span className="required">*</span>
            <input
              type="text"
              value={baseKeyword}
              onChange={(e) => setBaseKeyword(e.target.value)}
              placeholder="예: 의정부 강아지 분양"
              required
            />
          </label>

          <button type="submit" disabled={loading || !baseKeyword.trim()}>
            {loading ? "등록 중…" : "서브페이지 생성"}
          </button>
        </form>

        {lastCreated && (
          <div className="admin-preview">
            <p>
              <strong>자동 Title:</strong> {lastCreated.title}
            </p>
            <p>
              <strong>자동 Description:</strong> {lastCreated.description}
            </p>
            {lastCreated.matchedGroup && (
              <p>
                <strong>적용 그룹:</strong> {lastCreated.matchedGroup}
              </p>
            )}
          </div>
        )}

        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
      </section>

      <section className="admin-section">
        <h2>활성 서브페이지 ({keywords.length})</h2>
        {keywords.length === 0 ? (
          <p className="admin-empty">등록된 키워드가 없습니다.</p>
        ) : (
          <ul className="admin-list">
            {keywords.map((kw) => (
              <li key={kw.id}>
                <a
                  href={`/${encodeURIComponent(kw.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {kw.title}
                </a>
                <span className="admin-slug">/{kw.slug}</span>
                <span className="admin-kw">{kw.baseKeyword}</span>
                {kw.description && (
                  <span className="admin-desc-inline">{kw.description}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
