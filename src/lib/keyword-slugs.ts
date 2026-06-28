import type { KeywordEntry } from "@/types/keyword";
import keywordsData from "../../data/keywords.json";

/** 미들웨어(Edge)에서 사용 — 빌드 시점 keywords.json 기준 */
export function getRegisteredKeywordSlugs(): Set<string> {
  const entries = keywordsData as KeywordEntry[];
  return new Set(
    entries.filter((k) => k.active).map((k) => decodeURIComponent(k.slug))
  );
}

export function isRegisteredKeywordPath(pathname: string): boolean {
  const segment = pathname.replace(/^\//, "").split("/")[0];
  if (!segment) return false;
  return getRegisteredKeywordSlugs().has(decodeURIComponent(segment));
}
