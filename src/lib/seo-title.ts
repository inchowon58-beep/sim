/** 공백 제거 (의정부 강아지 분양 → 의정부강아지분양) */
export function compactKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, "");
}

export function buildAutoTitle(
  baseKeyword: string,
  brandName: string
): string {
  const compact = compactKeyword(baseKeyword);
  return `${compact} | ${brandName}`;
}
