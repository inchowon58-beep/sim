"use client";

import { useState } from "react";

interface KeywordItem {
  id: string;
  slug: string;
  title: string;
  baseKeyword: string;
}

interface KeywordAdminPanelProps {
  initialKeywords: KeywordItem[];
}

export function KeywordAdminPanel({ initialKeywords }: KeywordAdminPanelProps) {
  const [keywords, setKeywords] = useState(initialKeywords);
  const [baseKeyword, setBaseKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baseKeyword,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          useContentMixer: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록 실패");

      setKeywords((prev) => [...prev, data.entry]);
      setMessage(
        `등록 완료: /${data.entry.slug}` +
          (data.indexNow?.status
            ? ` (IndexNow: ${data.indexNow.status})`
            : "")
      );
      setBaseKeyword("");
      setTitle("");
      setDescription("");
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
          등록하면 서브페이지가 생성됩니다. 방문자에게는{" "}
          <strong>아가펫스토리</strong>가 보이고, 검색엔진에는 입력한
          키워드 SEO가 적용됩니다.
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            키워드 <span className="required">*</span>
            <input
              type="text"
              value={baseKeyword}
              onChange={(e) => setBaseKeyword(e.target.value)}
              placeholder="예: 강아지 분양"
              required
            />
          </label>

          <label>
            SEO Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="비워두면 자동 생성"
            />
          </label>

          <label>
            SEO Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="비워두면 자동 생성"
              rows={3}
            />
          </label>

          <button type="submit" disabled={loading || !baseKeyword.trim()}>
            {loading ? "등록 중…" : "서브페이지 생성"}
          </button>
        </form>

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
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
