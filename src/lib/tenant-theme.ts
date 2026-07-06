import type { TenantThemeColor } from "@/types/tenant";

const THEME_PRESETS: TenantThemeColor[] = [
  { primary: "#e85d04", secondary: "#f48c06", dark: "#1a1a1a", darkLight: "#2d2d2d", cream: "#fafafa" },
  { primary: "#2563eb", secondary: "#3b82f6", dark: "#0f172a", darkLight: "#1e293b", cream: "#f8fafc" },
  { primary: "#059669", secondary: "#10b981", dark: "#064e3b", darkLight: "#065f46", cream: "#f0fdf4" },
  { primary: "#7c3aed", secondary: "#8b5cf6", dark: "#1e1b4b", darkLight: "#312e81", cream: "#faf5ff" },
  { primary: "#dc2626", secondary: "#ef4444", dark: "#1c1917", darkLight: "#292524", cream: "#fafaf9" },
  { primary: "#0891b2", secondary: "#06b6d4", dark: "#164e63", darkLight: "#155e75", cream: "#ecfeff" },
];

export function pickThemeColor(seed?: string): TenantThemeColor {
  if (!seed) {
    return THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % THEME_PRESETS.length;
  return { ...THEME_PRESETS[idx] };
}

export function themeColorToCssVars(theme: TenantThemeColor): Record<string, string> {
  return {
    "--orange": theme.primary,
    "--orange-light": theme.secondary,
    "--dark": theme.dark,
    "--dark-light": theme.darkLight || theme.dark,
    "--cream": theme.cream || "#fafafa",
  };
}

export function themeColorToInlineStyle(theme: TenantThemeColor): Record<string, string> {
  return themeColorToCssVars(theme);
}
