import fs from "fs/promises";
import path from "path";
import type { KeywordEntry } from "@/types/keyword";
import keywordsSeed from "../../data/keywords.json";
import { keywordToSlug, parseSlug } from "./slug";

const DATA_PATH = path.join(process.cwd(), "data", "keywords.json");

async function readActiveKeywords(): Promise<KeywordEntry[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const keywords = JSON.parse(raw) as KeywordEntry[];
    return keywords.filter((k) => k.active);
  } catch {
    return (keywordsSeed as KeywordEntry[]).filter((k) => k.active);
  }
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
