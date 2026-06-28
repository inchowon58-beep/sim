import type { NextConfig } from "next";

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

/** false 로 명시하지 않는 한 앱 레벨 프록시 활성 (Vercel 등 Nginx 없는 환경) */
function isMainProxyEnabled(): boolean {
  return process.env.ENABLE_APP_LEVEL_MAIN_PROXY !== "false";
}

/**
 * 메인 및 비-키워드 경로 → agapetstory.co.kr 역방향 프록시
 * 키워드 서브페이지는 middleware가 x-seo-subpage 헤더를 붙여 제외
 */
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
