"use client";

import { useEffect, useState } from "react";

interface StorageStatus {
  runtime: string;
  ready: boolean;
  hasToken: boolean;
  hasStoreId: boolean;
  tokenEnvKey: string | null;
  writeTest: string;
  readTest: string;
  keywordCount: number | null;
  error?: string;
}

export function StorageStatusBanner() {
  const [status, setStatus] = useState<StorageStatus | null>(null);

  useEffect(() => {
    fetch("/api/storage-status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() =>
        setStatus({
          runtime: "unknown",
          ready: false,
          hasToken: false,
          hasStoreId: false,
          tokenEnvKey: null,
          writeTest: "fail",
          readTest: "fail",
          keywordCount: null,
          error: "저장소 상태 확인 실패",
        })
      );
  }, []);

  if (!status) return null;

  if (status.runtime === "local") return null;

  const fullyOk =
    status.writeTest === "ok" &&
    status.readTest === "ok" &&
    status.hasToken;

  if (fullyOk) {
    return (
      <div className="admin-success-banner" role="status">
        <strong>저장소 연결됨:</strong> 읽기·쓰기 정상
        {status.keywordCount !== null && (
          <span> · Blob 키워드 {status.keywordCount}개</span>
        )}
        {status.tokenEnvKey && (
          <span className="admin-desc-inline"> · {status.tokenEnvKey}</span>
        )}
      </div>
    );
  }

  if (status.writeTest === "ok" && status.readTest === "ok" && !status.hasToken) {
    return (
      <div className="admin-warning" role="alert">
        <strong>부분 연결 — 토큰 추가 권장</strong>
        <p className="admin-warning-detail">
          읽기·쓰기는 동작 중이지만 <code>BLOB_READ_WRITE_TOKEN</code>이 없습니다.
          키워드가 {status.keywordCount ?? 0}개 Blob에 저장되어 있습니다.
          안정성을 위해 sim-blob → .env.local 탭에서 토큰을 Environment
          Variables에 추가하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-warning" role="alert">
      <strong>저장소 읽기 실패 — 서브페이지가 404/빈 화면이 됩니다</strong>
      <p className="admin-warning-detail">
        쓰기: {status.writeTest} / 읽기: {status.readTest}
        {status.keywordCount !== null && ` / Blob 키워드: ${status.keywordCount}개`}
      </p>
      <ol className="admin-warning-steps">
        <li>
          Vercel → Storage → <strong>sim-blob</strong> → <strong>.env.local</strong>{" "}
          탭
        </li>
        <li>
          <code>BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...</code> 값 복사
        </li>
        <li>
          프로젝트 Settings → Environment Variables → Add
          <br />
          Name: <code>BLOB_READ_WRITE_TOKEN</code> / Production·Preview·Development
          모두 체크
        </li>
        <li>
          <strong>Redeploy</strong> 후 이 페이지 새로고침
        </li>
        <li>키워드·그룹 다시 등록</li>
      </ol>
      {status.error && (
        <p className="admin-warning-detail">오류: {status.error}</p>
      )}
    </div>
  );
}
