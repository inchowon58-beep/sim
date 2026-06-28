/** txt 파일에서 키워드 목록 파싱 (한 줄 하나 또는 쉼표 구분) */
export function parseKeywordList(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of text.split(/\r?\n/)) {
    for (const part of line.split(",")) {
      const keyword = part.trim();
      if (!keyword) continue;

      const key = keyword.replace(/\s+/g, " ").toLowerCase();
      if (seen.has(key)) continue;

      seen.add(key);
      result.push(keyword);
    }
  }

  return result;
}

export const MAX_BULK_KEYWORDS = 500;
