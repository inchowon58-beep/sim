import type { NextConfig } from "next";

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

/** 메인(/) 프록시 — 기본 OFF. 서브페이지는 iframe으로 agapetstory 표시 */
function isMainProxyEnabled(): boolean {
  return process.env.ENABLE_APP_LEVEL_MAIN_PROXY === "true";
}

const nextConfig: NextConfig = {
  async rewrites() {
    if (!isMainProxyEnabled()) {
      return { beforeFiles: [], afterFiles: [], fallback: [] };
    }

    return {
      beforeFiles: [
        {
          source: "/",
          missing: [{ type: "header", key: "x-seo-subpage", value: "true" }],
          destination: `${PROXY_TARGET}/`,
        },
        {
          source: "/:path*",
          missing: [{ type: "header", key: "x-seo-subpage", value: "true" }],
          destination: `${PROXY_TARGET}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
