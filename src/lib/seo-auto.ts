import { createSeededRandom, pickUnique, shuffle } from "./seeded-random";
import {
  buildDescriptionFromGroup,
  findMatchingKeywordGroup,
} from "./keyword-groups";

export interface AutoSeoResult {
  title: string;
  description: string;
  relatedKeywords: string[];
  region: string | null;
  matchedGroup?: string;
}

/** 공백 제거 (의정부 강아지 분양 → 의정부강아지분양) */
export function compactKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, "");
}

const PET_TOPIC_START =
  /^(?:강아지|고양이|애견|유기|반려|무료|입양|애완|펫|믹스|견종|파양|분양|보호|샵|센터|동물)/;

/** 키워드 앞부분에서 지역명 추출 (공백·붙여쓰기 모두 지원) */
export function extractRegion(keyword: string): string | null {
  const trimmed = keyword.trim();

  const withSuffix = trimmed.match(
    /^([\uAC00-\uD7A3]{2,}(?:시|군|구|도))(?:\s|$)/
  );
  if (withSuffix) return withSuffix[1];

  if (/\s/.test(trimmed)) {
    const first = trimmed.split(/\s+/)[0];
    if (first && first.length >= 2 && !PET_TOPIC_START.test(first)) {
      return first;
    }
    return null;
  }

  const compact = compactKeyword(trimmed);
  const compactMatch = compact.match(
    /^([\uAC00-\uD7A3]{2,4}(?:시|군|구|도)?)(?=(?:강아지|고양이|애견|유기|반려|무료|입양|애완|펫|믹스|견종|파양|분양|보호))/
  );
  if (compactMatch) {
    const raw = compactMatch[1];
    return raw.replace(/(시|군|구|도)$/u, "") || raw;
  }

  return null;
}

const PET_RELATED_TEMPLATES = [
  "{r}강아지분양",
  "{r}강아지무료분양",
  "{r}강아지입양",
  "{r}애견분양",
  "{r}고양이분양",
  "{r}애견샵",
  "{r}반려견",
  "{r}반려동물분양",
  "{r}펫샵",
  "{r}강아지샵",
  "{r}무료분양",
  "{r}입양센터",
  "{r}애완동물",
  "{r}믹스견분양",
  "{r}견종분양",
];

const GENERIC_TEMPLATES = [
  "강아지분양",
  "강아지무료분양",
  "강아지입양",
  "애견분양",
  "고양이분양",
  "애견샵",
  "반려견",
  "반려동물분양",
  "펫샵",
  "믹스견입양",
  "견종분양",
  "무료분양",
  "입양정보",
  "애완동물분양",
];

function applyRegion(template: string, region: string): string {
  return template.replace(/\{r\}/g, region);
}

/** 지역 + 연관 키워드 7~9개 (slug 시드 → URL마다 고정) — 그룹 미매칭 시 fallback */
export function generateRelatedKeywords(
  baseKeyword: string,
  slug: string,
  count?: number
): string[] {
  const rng = createSeededRandom(`rel:${slug}:${baseKeyword}`);
  const region = extractRegion(baseKeyword);
  const compact = compactKeyword(baseKeyword);
  const targetCount = count ?? 7 + Math.floor(rng() * 3);

  const pool: string[] = [compact];

  const templates = region
    ? PET_RELATED_TEMPLATES.map((t) => applyRegion(t, region))
    : [...GENERIC_TEMPLATES];

  for (const t of shuffle(rng, templates)) {
    if (pool.length >= 15) break;
    if (!pool.includes(t)) pool.push(t);
  }

  const basePool = pool.filter(Boolean);
  const picked = shuffle(rng, basePool).slice(0, targetCount);

  if (!picked.includes(compact)) {
    picked[0] = compact;
  }

  return [...new Set(picked)].slice(0, Math.min(9, Math.max(7, targetCount)));
}

export function buildAutoTitle(baseKeyword: string): string {
  const compact = compactKeyword(baseKeyword);
  return `${compact} | 아가펫스토리`;
}

export async function buildAutoDescription(
  baseKeyword: string,
  slug: string
): Promise<string> {
  const related = await generateRelatedKeywordsForSeo(baseKeyword, slug);
  return related.join(", ");
}

export async function generateRelatedKeywordsForSeo(
  baseKeyword: string,
  slug: string
): Promise<string[]> {
  const group = await findMatchingKeywordGroup(baseKeyword);
  if (group) {
    return buildDescriptionFromGroup(baseKeyword, group, slug);
  }
  return generateRelatedKeywords(baseKeyword, slug);
}

export async function buildAutoSeo(
  baseKeyword: string,
  slug: string
): Promise<AutoSeoResult> {
  const group = await findMatchingKeywordGroup(baseKeyword);
  const relatedKeywords = group
    ? buildDescriptionFromGroup(baseKeyword, group, slug)
    : generateRelatedKeywords(baseKeyword, slug);

  return {
    title: buildAutoTitle(baseKeyword),
    description: relatedKeywords.join(", "),
    relatedKeywords,
    region: extractRegion(baseKeyword),
    matchedGroup: group?.name,
  };
}
