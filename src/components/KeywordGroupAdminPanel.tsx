"use client";

import { useState } from "react";

interface KeywordGroupItem {
  id: string;
  name: string;
  keywords: string[];
}

interface KeywordGroupAdminPanelProps {
  initialGroups: KeywordGroupItem[];
}

export function KeywordGroupAdminPanel({
  initialGroups,
}: KeywordGroupAdminPanelProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [name, setName] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/keyword-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, keywords: keywordsText }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록 실패");

      setGroups((prev) => [...prev, data.entry]);
      setMessage(`그룹 "${data.entry.name}" 등록 완료`);
      setName("");
      setKeywordsText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록 중 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-panel">
      <section className="admin-section">
        <h2>Description 키워드 그룹</h2>
        <p className="admin-desc">
          쉼표(,)로 키워드를 등록합니다. 키워드 등록 시 입력값에 그룹 키워드가
          포함되면 해당 그룹으로 <strong>Description</strong>을 만듭니다.
          <br />
          예: 그룹에 <code>강아지파양</code> → <code>인천강아지파양</code>{" "}
          등록 시 →{" "}
          <code>
            인천강아지파양, 인천강아지보호소, 인천유기견보호소…
          </code>
        </p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            그룹명 <span className="required">*</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 강아지파양그룹"
              required
            />
          </label>

          <label>
            그룹 키워드 (쉼표 구분) <span className="required">*</span>
            <textarea
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="강아지파양, 강아지보호소, 유기견보호소, 유기동물보호소, 유기견보호센터"
              rows={3}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading || !name.trim() || !keywordsText.trim()}
          >
            {loading ? "등록 중…" : "그룹 추가"}
          </button>
        </form>

        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
      </section>

      <section className="admin-section">
        <h2>등록된 그룹 ({groups.length})</h2>
        {groups.length === 0 ? (
          <p className="admin-empty">등록된 그룹이 없습니다.</p>
        ) : (
          <ul className="admin-list admin-list--groups">
            {groups.map((g) => (
              <li key={g.id}>
                <strong>{g.name}</strong>
                <span className="admin-desc-inline">{g.keywords.join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
