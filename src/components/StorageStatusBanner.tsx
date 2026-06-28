"use client";

import { useEffect, useState } from "react";

interface StorageStatus {
  runtime: string;
  ready: boolean;
  hasToken: boolean;
  hasStoreId: boolean;
  tokenEnvKey: string | null;
  writeTest: string;
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
          error: "저장소 상태 확인 실패",
        })
      );
  }, []);

  if (!status) return null;

  if (status.runtime === "local") return null;

  if (status.writeTest === "ok") {
    return (
      <div className="admin-success-banner" role="status">
        <strong>저장소 연결됨:</strong> Vercel Blob 정상 (키워드·그룹이 영구
        저장됩니다)
        {status.tokenEnvKey && (
          <span className="admin-desc-inline"> · {status.tokenEnvKey}</span>
        )}
      </div>
    );
  }

  return (
    <div className="admin-warning" role="alert">
      <strong>저장소 미연결 — 서브페이지가 404/빈 화면이 됩니다</strong>
      <ol className="admin-warning-steps">
        <li>Vercel → Storage → <strong>sim-blob</strong> → Connect to Project</li>
        <li>프로젝트 선택 후 <strong>Redeploy</strong> (필수)</li>
        <li>
          Settings → Environment Variables에{" "}
          <code>BLOB_READ_WRITE_TOKEN</code> 또는 <code>BLOB_STORE_ID</code>{" "}
          확인 (Connect to Project 시 자동 추가)
        </li>
        <li>이 페이지 새로고침 후 초록색 &quot;저장소 연결됨&quot; 확인</li>
        <li>키워드·그룹 다시 등록</li>
      </ol>
      {status.error && (
        <p className="admin-warning-detail">오류: {status.error}</p>
      )}
      {!status.hasToken && !status.hasStoreId && (
        <p className="admin-warning-detail">
          현재 Blob 토큰이 배포 환경에 없습니다. 연결만 하고 재배포하지 않으면
          동작하지 않습니다.
        </p>
      )}
    </div>
  );
}
