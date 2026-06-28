import type {
  CreateKeywordInput,
  KeywordEntry,
} from "@/types/keyword";
import keywordsSeed from "../../data/keywords.json";
import { readJsonArray, writeJsonArray } from "./data-store";
import { generateUniqueSlug, keywordToSlug } from "./slug";
import { mixContentForBottom } from "./content-mixer";
import { pickRandomImage } from "./image-picker";
import { submitIndexNowForSlug } from "./indexnow";
import { buildAutoSeo } from "./seo-auto";

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
