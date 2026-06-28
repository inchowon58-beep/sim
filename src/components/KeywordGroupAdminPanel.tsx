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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editKeywordsText, setEditKeywordsText] = useState("");

  function startEdit(group: KeywordGroupItem) {
    setEditingId(group.id);
    setEditName(group.name);
    setEditKeywordsText(group.keywords.join(", "));
    setMessage(null);
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditKeywordsText("");
  }

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

  async function handleSaveEdit(id: string) {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/keyword-groups?id=${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          keywords: editKeywordsText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "수정 실패");

      setGroups((prev) =>
        prev.map((g) => (g.id === id ? data.entry : g))
      );
      setMessage(`그룹 "${data.entry.name}" 수정 완료`);
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "수정 중 오류");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, groupName: string) {
    if (!confirm(`"${groupName}" 그룹을 삭제할까요?`)) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/keyword-groups?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "삭제 실패");

      setGroups((prev) => prev.filter((g) => g.id !== id));
      if (editingId === id) cancelEdit();
      setMessage(`그룹 "${groupName}" 삭제 완료`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 중 오류");
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
            {loading ? "처리 중…" : "그룹 추가"}
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
              <li key={g.id} className="admin-group-item">
                {editingId === g.id ? (
                  <div className="admin-form admin-form--inline">
                    <label>
                      그룹명
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </label>
                    <label>
                      키워드 (쉼표 구분)
                      <textarea
                        value={editKeywordsText}
                        onChange={(e) => setEditKeywordsText(e.target.value)}
                        rows={3}
                      />
                    </label>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--primary"
                        disabled={
                          loading ||
                          !editName.trim() ||
                          !editKeywordsText.trim()
                        }
                        onClick={() => handleSaveEdit(g.id)}
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        disabled={loading}
                        onClick={cancelEdit}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-group-head">
                      <strong>{g.name}</strong>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          disabled={loading}
                          onClick={() => startEdit(g)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger"
                          disabled={loading}
                          onClick={() => handleDelete(g.id, g.name)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                    <span className="admin-desc-inline">
                      {g.keywords.join(", ")}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
