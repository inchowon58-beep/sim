/** 푸터 하단 키워드 텍스트 → 목록 (줄바꿈·쉼표·세미콜론) */
export function parseFooterKeywords(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];

  const seen = new Set<string>();
  const items: string[] = [];

  for (const part of raw.split(/[\n,;|]+/)) {
    const keyword = part.trim().replace(/\s+/g, " ");
    if (!keyword || keyword.length < 2) continue;
    const key = keyword.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(keyword);
  }

  return items;
}
