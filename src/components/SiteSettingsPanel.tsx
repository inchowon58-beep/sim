"use client";

import { useState } from "react";
import { buildAutoTitle } from "@/lib/seo-title";

interface SiteSettingsPanelProps {
  initialBrandName: string;
}

export function SiteSettingsPanel({ initialBrandName }: SiteSettingsPanelProps) {
  const [brandName, setBrandName] = useState(initialBrandName);
  const [savedName, setSavedName] = useState(initialBrandName);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewTitle = buildAutoTitle("의정부 강아지 파양", brandName.trim() || "업체명");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "저장 실패");

      setSavedName(data.settings.brandName);
      setBrandName(data.settings.brandName);
      setMessage("업체명이 저장되었습니다. 이후 신규 등록 키워드에 적용됩니다.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 중 오류");
    } finally {
      setLoading(false);
    }
  }

  const isDirty = brandName.trim() !== savedName;

  return (
    <section className="admin-section admin-section--settings">
      <h2>Title 업체명 설정</h2>
      <p className="admin-desc">
        신규 등록 Title 형식: <code>키워드 | 업체명</code>
        <br />
        <strong>이미 등록된 서브페이지</strong>는 등록 당시 Title을 유지하고,{" "}
        <strong>새로 등록하는 키워드</strong>에만 이 업체명이 적용됩니다.
      </p>

      <form className="admin-form admin-form--settings" onSubmit={handleSubmit}>
        <label>
          업체명 <span className="required">*</span>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="예: 아가펫스토리"
            maxLength={40}
            required
          />
        </label>

        <div className="admin-title-preview">
          <span className="admin-title-preview-label">미리보기</span>
          <strong>{previewTitle}</strong>
        </div>

        <button
          type="submit"
          disabled={loading || !brandName.trim() || !isDirty}
        >
          {loading ? "저장 중…" : "업체명 저장"}
        </button>
      </form>

      {message && <p className="admin-success">{message}</p>}
      {error && <p className="admin-error">{error}</p>}
    </section>
  );
}
