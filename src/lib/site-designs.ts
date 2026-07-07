/** 사이트 생성 시 선택하는 상위 디자인 템플릿 */
export const SITE_DESIGN_OPTIONS = [
  {
    id: "a",
    label: "A 디자인",
    description: "기본 레이아웃 · 좌측 히어로 · 랜덤 섹션·헤더 변형",
  },
  {
    id: "b",
    label: "B 디자인",
    description: "cleneo 스타일 · 상단 띠배너 · 센터 히어로 · 사업영역·FAQ·폐업지원금",
  },
] as const;

export type SiteDesignId = (typeof SITE_DESIGN_OPTIONS)[number]["id"];

export const DEFAULT_SITE_DESIGN: SiteDesignId = "a";

const DESIGN_IDS = new Set<string>(SITE_DESIGN_OPTIONS.map((o) => o.id));

export function parseSiteDesignId(value: unknown): SiteDesignId {
  const id = String(value || "").toLowerCase();
  return DESIGN_IDS.has(id) ? (id as SiteDesignId) : DEFAULT_SITE_DESIGN;
}

export function siteDesignLabel(id: SiteDesignId | string | null | undefined): string {
  const found = SITE_DESIGN_OPTIONS.find((o) => o.id === id);
  return found?.label ?? "A 디자인";
}
