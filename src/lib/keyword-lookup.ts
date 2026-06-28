import type { KeywordEntry } from "@/types/keyword";
import keywordsSeed from "../../data/keywords.json";
import { readJsonArray } from "./data-store";
import { keywordToSlug, parseSlug } from "./slug";

const DATA_FILE = "data/keywords.json";

async function readActiveKeywords(): Promise<KeywordEntry[]> {
  const keywords = await readJsonArray<KeywordEntry>(
    DATA_FILE,
    keywordsSeed as KeywordEntry[]
  );
  return keywords.filter((k) => k.active);
}

function normalizeKeywordKey(keyword: string): string {
  return keyword.trim().replace(/\s+/g, " ").toLowerCase();
}

/** 인근 지역 키워드에 대응하는 활성 서브페이지 slug (없으면 null) */
export async function findActiveKeywordSlug(
  candidateKeyword: string
): Promise<string | null> {
  const keywords = await readActiveKeywords();
  const candidateSlug = keywordToSlug(candidateKeyword);
  const normalizedCandidate = normalizeKeywordKey(candidateKeyword);

  const exact = keywords.find((k) => k.slug === candidateSlug);
  if (exact) return exact.slug;

  const byBase = keywords.find(
    (k) => normalizeKeywordKey(k.baseKeyword) === normalizedCandidate
  );
  if (byBase) return byBase.slug;

  const withBase = keywords.filter((k) => {
    const { baseSlug } = parseSlug(k.slug);
    return baseSlug === candidateSlug;
  });
  if (withBase.length > 0) {
    const preferred = withBase.find((k) => k.suffix === null) ?? withBase[0];
    return preferred.slug;
  }

  return null;
}
