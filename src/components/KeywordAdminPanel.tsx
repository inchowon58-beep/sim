"use client";

import { useMemo, useRef, useState } from "react";

const PAGE_SIZE = 10;
const MAX_DISPLAY = 100;
const MAX_BULK = 500;

interface KeywordItem {
  id: string;
  slug: string;
  baseKeyword: string;
  createdAt: string;
}

interface KeywordAdminPanelProps {
  initialKeywords: KeywordItem[];
}

function sortByLatest(items: KeywordItem[]): KeywordItem[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function KeywordAdminPanel({ initialKeywords }: KeywordAdminPanelProps) {
  const [keywords, setKeywords] = useState(() =>
    sortByLatest(initialKeywords)
  );
  const [page, setPage] = useState(1);
  const [baseKeyword, setBaseKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastCreated, setLastCreated] = useState<{
    title: string;
    description: string;
    matchedGroup?: string;
  } | null>(null);

  const displayList = useMemo(
    () => sortByLatest(keywords).slice(0, MAX_DISPLAY),
    [keywords]
  );

  const totalPages = Math.max(1, Math.ceil(displayList.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = displayList.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const totalCount = keywords.length;

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

      setKeywords((prev) =>
        sortByLatest([
          {
            id: data.entry.id,
            slug: data.entry.slug,
            baseKeyword: data.entry.baseKeyword,
            createdAt: data.entry.createdAt,
          },
          ...prev,
        ])
      );
      setPage(1);
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

  function goToPage(next: number) {
    setPage(Math.max(1, Math.min(totalPages, next)));
  }

  async function handleBulkFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBulkLoading(true);
    setMessage(null);
    setError(null);
    setLastCreated(null);

    try {
      const text = await file.text();
      const res = await fetch("/api/keywords/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "대량 등록 실패");

      if (data.created?.length) {
        setKeywords((prev) =>
          sortByLatest([
            ...data.created.map(
              (entry: {
                id: string;
                slug: string;
                baseKeyword: string;
                createdAt: string;
              }) => ({
                id: entry.id,
                slug: entry.slug,
                baseKeyword: entry.baseKeyword,
                createdAt: entry.createdAt,
              })
            ),
            ...prev,
          ])
        );
        setPage(1);
      }

      const failedNote =
        data.failedCount > 0 ? ` · 실패 ${data.failedCount}개` : "";
      const indexNowNote = data.indexNow?.status
        ? ` · IndexNow: ${data.indexNow.status}`
        : "";

      setMessage(
        `파일 등록 완료: ${data.createdCount}개${failedNote}${indexNowNote}`
      );

      if (data.failed?.length) {
        setError(
          `실패 항목: ${data.failed
            .slice(0, 5)
            .map((f: { keyword: string; error: string }) => `${f.keyword} (${f.error})`)
            .join(", ")}${data.failed.length > 5 ? " …" : ""}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "파일 등록 중 오류");
    } finally {
      setBulkLoading(false);
    }
  }

  const isBusy = loading || bulkLoading;

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

          <button type="submit" disabled={isBusy || !baseKeyword.trim()}>
            {loading ? "등록 중…" : "서브페이지 생성"}
          </button>
        </form>

        <div className="admin-bulk-import">
          <p className="admin-bulk-import-label">대량 등록</p>
          <p className="admin-bulk-import-desc">
            txt 파일 — <strong>한 줄에 키워드 하나</strong> 또는{" "}
            <strong>쉼표(,)</strong>로 구분 · 최대 {MAX_BULK}개 · IndexNow
            일괄 전송
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            className="admin-file-input"
            onChange={handleBulkFile}
            disabled={isBusy}
          />
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            disabled={isBusy}
            onClick={() => fileInputRef.current?.click()}
          >
            {bulkLoading ? "파일 등록 중…" : "파일로 불러오기"}
          </button>
        </div>

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

      <section className="admin-section admin-section--keywords">
        <div className="admin-section-head">
          <div>
            <h2>활성 서브페이지</h2>
            <p className="admin-section-meta">
              총 {totalCount}개 · 최신 {Math.min(totalCount, MAX_DISPLAY)}개
              표시 · 페이지당 {PAGE_SIZE}개
            </p>
          </div>
          {displayList.length > 0 && (
            <span className="admin-page-indicator">
              {safePage} / {totalPages}
            </span>
          )}
        </div>

        {displayList.length === 0 ? (
          <p className="admin-empty">등록된 키워드가 없습니다.</p>
        ) : (
          <>
            <ul className="admin-kw-grid">
              {pageItems.map((kw) => (
                <li key={kw.id}>
                  <a
                    className="admin-kw-link"
                    href={`/${encodeURIComponent(kw.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {kw.baseKeyword}
                  </a>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <nav className="admin-pagination" aria-label="서브페이지 목록">
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={safePage <= 1}
                  onClick={() => goToPage(safePage - 1)}
                >
                  이전
                </button>
                <div className="admin-pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <button
                        key={n}
                        type="button"
                        className={`admin-page-btn${n === safePage ? " is-active" : ""}`}
                        onClick={() => goToPage(n)}
                        aria-current={n === safePage ? "page" : undefined}
                      >
                        {n}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={safePage >= totalPages}
                  onClick={() => goToPage(safePage + 1)}
                >
                  다음
                </button>
              </nav>
            )}
          </>
        )}

        {totalCount > MAX_DISPLAY && (
          <p className="admin-list-note">
            최신 {MAX_DISPLAY}개만 표시됩니다. (전체 {totalCount}개)
          </p>
        )}
      </section>
    </div>
  );
}
