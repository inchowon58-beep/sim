import type {
  CreateKeywordGroupInput,
  KeywordGroup,
} from "@/types/keyword-group";
import groupsSeed from "../../data/keyword-groups.json";
import { readJsonArray, writeJsonArray } from "./data-store";
import { compactKeyword, extractRegion } from "./seo-auto";

const DATA_FILE = "data/keyword-groups.json";

function createId(): string {
  return `grp-${Date.now().toString(36)}`;
}

function parseKeywordsInput(input: string | string[]): string[] {
  const raw = Array.isArray(input)
    ? input
    : input.split(",").map((s) => s.trim());

  return [...new Set(raw.map((k) => k.replace(/\s+/g, "")).filter(Boolean))];
}

export async function getAllKeywordGroups(): Promise<KeywordGroup[]> {
  const groups = await readJsonArray<KeywordGroup>(
    DATA_FILE,
    groupsSeed as KeywordGroup[]
  );
  return groups.filter((g) => g.active);
}

export async function getAllKeywordGroupsIncludingInactive(): Promise<
  KeywordGroup[]
> {
  return readJsonArray<KeywordGroup>(DATA_FILE, groupsSeed as KeywordGroup[]);
}

/** 키워드에 포함된 그룹 트리거 중 가장 긴 매칭 그룹 */
export async function findMatchingKeywordGroup(
  baseKeyword: string
): Promise<KeywordGroup | null> {
  const compact = compactKeyword(baseKeyword);
  const groups = await getAllKeywordGroups();

  let best: { group: KeywordGroup; len: number } | null = null;

  for (const group of groups) {
    for (const trigger of group.keywords) {
      const t = trigger.replace(/\s+/g, "");
      if (t && compact.includes(t)) {
        if (!best || t.length > best.len) {
          best = { group, len: t.length };
        }
      }
    }
  }

  return best?.group ?? null;
}

/** 그룹 키워드 + 지역 접두 → description 목록 */
export function buildDescriptionFromGroup(
  baseKeyword: string,
  group: KeywordGroup
): string[] {
  const compact = compactKeyword(baseKeyword);
  const region = extractRegion(baseKeyword);
  const regionNorm = region?.replace(/(시|군|구)$/u, "") ?? null;

  const terms = group.keywords.map((k) => k.replace(/\s+/g, ""));

  const result = terms.map((term) => {
    if (regionNorm) return `${regionNorm}${term}`;
    return term;
  });

  if (!result.includes(compact)) {
    result.unshift(compact);
  }

  return [...new Set(result)];
}

export async function createKeywordGroup(
  input: CreateKeywordGroupInput
): Promise<KeywordGroup> {
  const keywords = parseKeywordsInput(input.keywords);
  if (!input.name?.trim()) throw new Error("그룹명은 필수입니다.");
  if (keywords.length === 0) throw new Error("키워드를 1개 이상 입력하세요.");

  const groups = await getAllKeywordGroupsIncludingInactive();
  const now = new Date().toISOString();

  const entry: KeywordGroup = {
    id: createId(),
    name: input.name.trim(),
    keywords,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  groups.push(entry);
  await writeJsonArray(DATA_FILE, groups);
  return entry;
}

export async function updateKeywordGroup(
  id: string,
  patch: Partial<Pick<KeywordGroup, "name" | "keywords" | "active">>
): Promise<KeywordGroup | null> {
  const groups = await getAllKeywordGroupsIncludingInactive();
  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) return null;

  const next = { ...groups[index], updatedAt: new Date().toISOString() };

  if (patch.name !== undefined) next.name = patch.name.trim();
  if (patch.active !== undefined) next.active = patch.active;
  if (patch.keywords !== undefined) {
    const parsed = parseKeywordsInput(patch.keywords);
    if (parsed.length === 0) throw new Error("키워드를 1개 이상 입력하세요.");
    next.keywords = parsed;
  }

  groups[index] = next;
  await writeJsonArray(DATA_FILE, groups);
  return next;
}

export async function deactivateKeywordGroup(id: string): Promise<boolean> {
  const updated = await updateKeywordGroup(id, { active: false });
  return updated !== null;
}

/** 그룹 완전 삭제 */
export async function deleteKeywordGroup(id: string): Promise<boolean> {
  const groups = await getAllKeywordGroupsIncludingInactive();
  const next = groups.filter((g) => g.id !== id);
  if (next.length === groups.length) return false;
  await writeJsonArray(DATA_FILE, next);
  return true;
}
