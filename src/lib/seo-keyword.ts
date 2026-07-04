import { extractRegionFromKeyword } from "./region-parse";

function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function dedupeRegionInCompact(text: string, region: string): string {
  let result = text;
  while (result.includes(region + region)) {
    result = result.replaceAll(region + region, region);
  }
  return result;
}

function insertSpacesForKeyword(compact: string, region: string): string {
  if (!compact.startsWith(region)) return compact;

  const rest = compact.slice(region.length);
  const breakWords = ["견적", "지원금", "원상복구", "폐업", "상가", "비용", "무료", "방문"];
  let tail = rest;
  const parts: string[] = [region];

  for (const word of breakWords) {
    const idx = tail.indexOf(word);
    if (idx > 0) {
      parts.push(tail.slice(0, idx), word);
      tail = tail.slice(idx + word.length);
    } else if (idx === 0) {
      parts.push(word);
      tail = tail.slice(word.length);
    }
  }

  if (tail) parts.push(tail);
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/** "자양동 자양동철거" → "자양동철거" 등 지역 중복 제거 */
export function dedupeRegionInText(text: string, region: string | null): string {
  if (!text?.trim()) return "";
  if (!region) return text.trim().replace(/\s+/g, " ");

  const esc = escapeRegExp(region);
  let result = text.trim().replace(/\s+/g, " ");

  // "자양동 자양동" / "자양동 자양동철거업체"
  result = result.replace(new RegExp(`^${esc}\\s+${esc}(?=[가-힣])`, "i"), region);
  result = result.replace(new RegExp(`(${esc})\\s+\\1`, "gi"), "$1");

  const compact = result.replace(/\s/g, "");
  const dedupedCompact = dedupeRegionInCompact(compact, region);
  if (dedupedCompact !== compact) {
    result = insertSpacesForKeyword(dedupedCompact, region);
  }

  return result.replace(/\s+/g, " ").trim();
}

/** 입력 키워드 정규화 — 지역·띄어쓰기 중복 정리 */
export function normalizeSeoKeyword(keyword: string): string {
  const spaced = keyword.trim().replace(/\s+/g, " ");
  const compact = spaced.replace(/\s/g, "");
  const region =
    extractRegionFromKeyword(compact) || extractRegionFromKeyword(spaced);

  if (!region) return spaced;

  const fixedCompact = dedupeRegionInCompact(compact, region);
  return insertSpacesForKeyword(fixedCompact, region);
}

/** 지역명을 제외한 서비스 문구 (제목 조합용) */
export function extractServicePhrase(keyword: string, region: string | null): string {
  const normalized = normalizeSeoKeyword(keyword);
  if (!region) return normalized;

  const esc = escapeRegExp(region);
  const withoutRegion = normalized
    .replace(new RegExp(`^${esc}\\s*`, "i"), "")
    .trim();

  if (withoutRegion) return withoutRegion;
  return normalized;
}

/** 제목·설명용 핵심 키워드 (지역 1회) */
export function buildSeoCorePhrase(keyword: string): string {
  const normalized = normalizeSeoKeyword(keyword);
  const region = extractRegionFromKeyword(normalized.replace(/\s/g, ""));
  return dedupeRegionInText(normalized, region);
}

export function polishSeoText(text: string, region: string | null): string {
  return dedupeRegionInText(text, region);
}

const TITLE_TEMPLATES: ((phrase: string, region: string | null) => string)[] = [
  (phrase, region) =>
    `${region ? `${region} ` : ""}${phrase} | {{brandName}}`.trim(),
  (phrase) => `{{brandName}} · ${phrase} 무료 현장 견적`,
  (phrase, region) =>
    `${region ? `${region} ` : ""}${phrase} — 폐업지원금·철거 원스톱`.trim(),
  (phrase) => `${phrase} 전문 시공 | {{brandName}}`,
  (phrase, region) =>
    `${region ? `${region} ` : ""}폐업철거 ${phrase} | {{brandName}}`.trim(),
  (phrase) => `{{brandName}} ${phrase} 비용·일정 상담`,
  (phrase, region) =>
    `${phrase} 맞춤 견적${region ? ` (${region})` : ""} | {{brandName}}`,
  (phrase) => `${phrase} · 철거·원상복구 {{brandName}}`,
  (phrase, region) =>
    `${region ? `${region} ` : ""}${phrase} 현장 안내 | {{brandName}}`.trim(),
  (phrase) => `{{brandName}} | ${phrase} 지원금·견적`,
];

/** 최종 제목 — 지역 중복·템플릿 중복 prefix 제거 */
export function finalizeSeoTitle(title: string, keyword: string): string {
  const region = extractRegionFromKeyword(
    normalizeSeoKeyword(keyword).replace(/\s/g, "")
  );
  let result = dedupeRegionInText(title.trim(), region);

  if (region) {
    const esc = escapeRegExp(region);
    result = result.replace(new RegExp(`^${esc}\\s+${esc}`, "i"), region);
    result = dedupeRegionInText(result, region);
  }

  return result.slice(0, 60);
}

/** 키워드·해시 기반 SEO 제목 (페이지마다 다른 패턴) */
export function generateVariedSeoTitle(
  keyword: string,
  region: string | null,
  aiTitle?: string
): string {
  const phrase = extractServicePhrase(keyword, region);
  const idx = hashText(`${keyword}-${phrase}-title`) % TITLE_TEMPLATES.length;
  const templateTitle = TITLE_TEMPLATES[idx](phrase, region);

  if (!aiTitle?.trim()) {
    return finalizeSeoTitle(templateTitle, keyword);
  }

  const polishedAi = polishSeoText(aiTitle.trim(), region);
  const compactAi = polishedAi.replace(/\s/g, "");
  const aiLooksDuplicate =
    !!region &&
    (new RegExp(`${escapeRegExp(region)}\\s+${escapeRegExp(region)}`, "i").test(
      polishedAi
    ) ||
      compactAi.includes(region + region));

  const aiTooGeneric =
    polishedAi.includes("견적 저렴한") ||
    polishedAi.includes("견적 지원금") ||
    (polishedAi.match(/\|/g)?.length ?? 0) > 1;

  if (aiLooksDuplicate || aiTooGeneric || polishedAi.length > 60) {
    return finalizeSeoTitle(templateTitle, keyword);
  }

  return finalizeSeoTitle(polishedAi, keyword);
}
