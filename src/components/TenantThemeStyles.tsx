import type { TenantThemeColor } from "@/types/tenant";
import { getTenantCssVariables } from "@/utils/siteConfig";

interface TenantThemeStylesProps {
  theme: TenantThemeColor | null;
}

/** 테넌트 사이트일 때만 :root CSS 변수를 덮어씁니다. 레거시 사이트는 no-op. */
export default function TenantThemeStyles({ theme }: TenantThemeStylesProps) {
  const vars = getTenantCssVariables(theme);
  if (!vars) return null;

  const css = `:root { ${Object.entries(vars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ")}; }`;

  return <style data-tenant-theme="">{css}</style>;
}
