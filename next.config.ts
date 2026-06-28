import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

/** false 가 아니면 / 및 비-키워드 경로 → agapetstory 프록시 (기본 ON) */
function isMainProxyEnabled(): boolean {
  return process.env.ENABLE_APP_LEVEL_MAIN_PROXY !== "false";
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
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
