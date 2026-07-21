import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Vercel serverless에 data/seo-static JSON 포함 (로컬 발행 페이지)
  outputFileTracingIncludes: {
    "/guide/[slug]": ["./data/seo-static/**/*"],
    "/guide/[slug]/opengraph-image": ["./data/seo-static/**/*"],
  },
  async redirects() {
    return [
      {
        source: "/seo/:slug",
        destination: "/guide/:slug",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/feed.xml", destination: "/feed" },
      { source: "/rss.xml", destination: "/feed" },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.cattery.co.kr",
        pathname: "/dogboho/**",
      },
      {
        protocol: "https",
        hostname: "image.cattery.co.kr",
        pathname: "/chul/**",
      },
      {
        protocol: "https",
        hostname: "image.cattery.co.kr",
        pathname: "/com2pet/**",
      },
      {
        protocol: "https",
        hostname: "cdn.imweb.me",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "demolishzone.yourdogzone.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.yourdogzone.co.kr",
        pathname: "/**",
      },
      // 로컬 SEO 발행기에서 지정한 임의 https 이미지 URL
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
