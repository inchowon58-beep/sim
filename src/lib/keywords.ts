import type {
  CreateKeywordInput,
  KeywordEntry,
} from "@/types/keyword";
import keywordsSeed from "../../data/keywords.json";
import { readJsonArray, writeJsonArray } from "./data-store";
import { generateUniqueSlug, keywordToSlug } from "./slug";
import { mixContentForBottom } from "./content-mixer";
import { pickRandomImage } from "./image-picker";
import { submitIndexNow, submitIndexNowForSlug, buildSubpageUrl } from "./indexnow";
import { buildAutoSeo } from "./seo-auto";
import {
  MAX_BULK_KEYWORDS,
  parseKeywordList,
} from "./keyword-import";
import type { IndexNowLogEntry } from "@/types/indexnow";

export { parseKeywordList, MAX_BULK_KEYWORDS };

const DATA_FILE = "data/keywords.json";

function createId(): string {
  return `kw-${Date.now().toString(36)}`;
}

async function readAllEntries(): Promise<KeywordEntry[]> {
  return readJsonArray<KeywordEntry>(DATA_FILE, keywordsSeed as KeywordEntry[]);
}

async function writeAllEntries(keywords: KeywordEntry[]): Promise<void> {
  await writeJsonArray(DATA_FILE, keywords);
}

export async function getAllKeywords(): Promise<KeywordEntry[]> {
  const keywords = await readAllEntries();
  return keywords.filter((k) => k.active);
}

function normalizeSlug(value: string): string {
  return decodeURIComponent(value).trim();
}

export async function getKeywordBySlug(
  slug: string
): Promise<KeywordEntry | null> {
  const keywords = await readAllEntries();
  const decoded = normalizeSlug(slug);
  const active = keywords.filter((k) => k.active);

  const exact = active.find((k) => normalizeSlug(k.slug) === decoded);
  if (exact) return exact;

  const byGenerated = active.find(
    (k) => keywordToSlug(k.baseKeyword) === decoded
  );
  if (byGenerated) return byGenerated;

  return null;
}

export async function getAllSlugs(): Promise<string[]> {
  const keywords = await readAllEntries();
  return keywords.map((k) => k.slug);
}

/** 키워드 추가 → 슬러그 자동 생성 → 페이지 즉시 활성화 + IndexNow 제출 */
export async function createKeyword(
  input: CreateKeywordInput
): Promise<{
  entry: KeywordEntry;
  matchedGroup?: string;
  indexNow?: Awaited<ReturnType<typeof submitIndexNowForSlug>>;
}> {
  const keywords = await readAllEntries();
  const existingSlugs = keywords.map((k) => k.slug);
  const { slug, suffix } = generateUniqueSlug(input.baseKeyword, existingSlugs);

  const now = new Date().toISOString();
  const baseKeyword = input.baseKeyword.trim();
  const autoSeo = await buildAutoSeo(baseKeyword, slug);
  const useContentMixer = input.useContentMixer ?? true;
  const mixedImageUrl = await pickRandomImage(slug);

  const entry: KeywordEntry = {
    id: createId(),
    slug,
    baseKeyword,
    suffix,
    title: input.title?.trim() || autoSeo.title,
    description: input.description?.trim() || autoSeo.description,
    content: useContentMixer
      ? await mixContentForBottom(baseKeyword, slug)
      : (input.content ?? ""),
    useContentMixer,
    mixedImageUrl: mixedImageUrl ?? undefined,
    ogImage: input.ogImage ?? mixedImageUrl ?? undefined,
    tags: input.tags ?? autoSeo.relatedKeywords,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  keywords.push(entry);
  await writeAllEntries(keywords);

  const indexNow = await submitIndexNowForSlug(entry.slug, "create").catch(
    (error) => {
      console.error("[IndexNow] create submit failed:", error);
      return undefined;
    }
  );

  return { entry, matchedGroup: autoSeo.matchedGroup, indexNow };
}

export async function updateKeyword(
  slug: string,
  patch: Partial<
    Pick<
      KeywordEntry,
      "title" | "description" | "content" | "ogImage" | "tags" | "active" | "useContentMixer" | "mixedImageUrl"
    >
  >
): Promise<{
  entry: KeywordEntry | null;
  indexNow?: Awaited<ReturnType<typeof submitIndexNowForSlug>>;
}> {
  const keywords = await readAllEntries();
  const decoded = decodeURIComponent(slug);
  const index = keywords.findIndex((k) => k.slug === decoded);

  if (index === -1) return { entry: null };

  keywords[index] = {
    ...keywords[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await writeAllEntries(keywords);
  const updated = keywords[index];

  let indexNow: Awaited<ReturnType<typeof submitIndexNowForSlug>> | undefined;
  if (updated.active) {
    indexNow = await submitIndexNowForSlug(updated.slug, "update").catch(
      (error) => {
        console.error("[IndexNow] update submit failed:", error);
        return undefined;
      }
    );
  }

  return { entry: updated, indexNow };
}

export async function deactivateKeyword(slug: string): Promise<boolean> {
  const { entry } = await updateKeyword(slug, { active: false });
  return entry !== null;
}

export interface BulkCreateKeywordResult {
  created: KeywordEntry[];
  failed: { keyword: string; error: string }[];
  indexNow?: IndexNowLogEntry;
}

/** txt·쉼표 구분 키워드 대량 등록 (단일 저장 + IndexNow 일괄 제출) */
export async function createKeywordsBulk(
  rawKeywords: string[]
): Promise<BulkCreateKeywordResult> {
  const keywords = rawKeywords
    .map((k) => k.trim())
    .filter(Boolean);

  if (keywords.length === 0) {
    throw new Error("등록할 키워드가 없습니다.");
  }

  if (keywords.length > MAX_BULK_KEYWORDS) {
    throw new Error(
      `한 번에 최대 ${MAX_BULK_KEYWORDS}개까지 등록할 수 있습니다. (요청: ${keywords.length}개)`
    );
  }

  const allEntries = await readAllEntries();
  const slugList = allEntries.map((k) => k.slug);
  const slugSet = new Set(slugList.map((s) => decodeURIComponent(s)));

  const created: KeywordEntry[] = [];
  const failed: { keyword: string; error: string }[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < keywords.length; i++) {
    const baseKeyword = keywords[i];

    try {
      const { slug, suffix } = generateUniqueSlug(baseKeyword, slugList);
      slugList.push(slug);
      slugSet.add(slug);

      const autoSeo = await buildAutoSeo(baseKeyword, slug);
      const mixedImageUrl = await pickRandomImage(slug);

      const entry: KeywordEntry = {
        id: `kw-${Date.now().toString(36)}-${i.toString(36)}`,
        slug,
        baseKeyword,
        suffix,
        title: autoSeo.title,
        description: autoSeo.description,
        content: "",
        useContentMixer: true,
        mixedImageUrl: mixedImageUrl ?? undefined,
        ogImage: mixedImageUrl ?? undefined,
        tags: autoSeo.relatedKeywords,
        active: true,
        createdAt: now,
        updatedAt: now,
      };

      allEntries.push(entry);
      created.push(entry);
    } catch (error) {
      failed.push({
        keyword: baseKeyword,
        error: error instanceof Error ? error.message : "등록 실패",
      });
    }
  }

  if (created.length > 0) {
    await writeAllEntries(allEntries);
  }

  let indexNow: IndexNowLogEntry | undefined;
  if (created.length > 0) {
    const urlList = created.map((entry) => buildSubpageUrl(entry.slug));
    const chunkSize = 100;

    for (let i = 0; i < urlList.length; i += chunkSize) {
      const chunk = urlList.slice(i, i + chunkSize);
      const result = await submitIndexNow(chunk, "create").catch((error) => {
        console.error("[IndexNow] bulk submit failed:", error);
        return undefined;
      });
      if (result) indexNow = result;
    }
  }

  return { created, failed, indexNow };
}

/** txt 본문에서 파싱 후 대량 등록 */
export async function createKeywordsFromText(
  text: string
): Promise<BulkCreateKeywordResult> {
  const parsed = parseKeywordList(text);
  if (parsed.length === 0) {
    throw new Error(
      "파일에서 키워드를 찾을 수 없습니다. 한 줄에 하나 또는 쉼표(,)로 구분해 주세요."
    );
  }
  return createKeywordsBulk(parsed);
}
