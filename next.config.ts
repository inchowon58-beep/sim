import type { NextConfig } from "next";

const PROXY_TARGET =
  process.env.MAIN_PROXY_TARGET ?? "https://www.agapetstory.co.kr";

/**
 * 메인(/) 페이지는 Nginx 등 인프라에서 역방향 프록시로 처리하는 것을 권장합니다.
 * 개발·단독 실행 시에만 아래 rewrite로 agapetstory 콘텐츠를 프록시합니다.
 * 프로덕션 Nginx 예시는 README.md를 참고하세요.
 */
const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.ENABLE_APP_LEVEL_MAIN_PROXY !== "true") {
      return [];
    }

    // 키워드 서브페이지(/[slug])는 App Router가 우선 처리합니다.
    return [
      {
        source: "/",
        destination: `${PROXY_TARGET}/`,
      },
    ];
  },
};

export default nextConfig;
