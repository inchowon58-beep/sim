import type { CSSProperties, ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  dark: "#1a1a1a",
  orange: "#e85d04",
  orangeLight: "#f48c06",
  white: "#ffffff",
  gray: "#9ca3af",
};

interface OgBrandedProps {
  brandName: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export function OgBrandedLayout({
  brandName,
  title,
  subtitle,
  badge,
}: OgBrandedProps): ReactNode {
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "56px 64px",
    fontFamily: "sans-serif",
    background: `linear-gradient(135deg, ${OG_COLORS.dark} 0%, #2d2d2d 45%, ${OG_COLORS.orange} 160%)`,
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 16,
            background: OG_COLORS.orange,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: OG_COLORS.white,
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          아가
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ color: OG_COLORS.white, fontSize: 36, fontWeight: 800 }}>
            {brandName}
          </div>
          <div style={{ color: OG_COLORS.gray, fontSize: 22 }}>강아지·고양이 파양 · 무료분양</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
        {badge && (
          <div
            style={{
              alignSelf: "flex-start",
              background: OG_COLORS.orange,
              color: OG_COLORS.white,
              fontSize: 22,
              fontWeight: 700,
              padding: "10px 24px",
              borderRadius: 999,
            }}
          >
            {badge}
          </div>
        )}
        <div
          style={{
            color: OG_COLORS.white,
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ color: "#d1d5db", fontSize: 28, lineHeight: 1.4 }}>{subtitle}</div>
        )}
      </div>

      <div style={{ color: OG_COLORS.gray, fontSize: 20 }}>
        파양 · 무료분양 · 입양 상담
      </div>
    </div>
  );
}

/** 파란색 원 + 흰색 체크 파비콘 */
export function FaviconLayout({ size }: { size: number }): ReactNode {
  const pad = Math.round(size * 0.22);
  const stroke = Math.max(2, Math.round(size * 0.12));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2563eb",
        borderRadius: "50%",
      }}
    >
      <svg
        width={size - pad * 2}
        height={size - pad * 2}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5 12.5l5 5L19 7"
          stroke="#ffffff"
          strokeWidth={stroke > 4 ? 3.2 : 2.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
