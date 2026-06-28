import fs from "fs/promises";
import path from "path";
import type {
  CreateKeywordInput,
  KeywordEntry,
  KeywordStore,
} from "@/types/keyword";
import keywordsSeed from "../../data/keywords.json";
import { generateUniqueSlug } from "./slug";
import { mixContentForBottom } from "./content-mixer";
import { pickRandomImage } from "./image-picker";
import { submitIndexNowForSlug } from "./indexnow";
import { buildAutoSeo } from "./seo-auto";

const DATA_PATH = path.join(process.cwd(), "data", "keywords.json");

async function readStore(): Promise<KeywordStore> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const keywords = JSON.parse(raw) as KeywordEntry[];
    return { keywords };
  } catch {
    return { keywords: [...(keywordsSeed as KeywordEntry[])] };
  }
}

async function writeStore(store: KeywordStore): Promise<void> {
  try {
    await fs.writeFile(
      DATA_PATH,
      JSON.stringify(store.keywords, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.warn("[keywords] write skipped (read-only env):", error);
  }
}

function createId(): string {
  return `kw-${Date.now().toString(36)}`;
}

export async function getAllKeywords(): Promise<KeywordEntry[]> {
  const store = await readStore();
  return store.keywords.filter((k) => k.active);
}

export async function getKeywordBySlug(
  slug: string
): Promise<KeywordEntry | null> {
  const store = await readStore();
  const decoded = decodeURIComponent(slug);
  return (
    store.keywords.find((k) => k.active && k.slug === decoded) ?? null
  );
}

export async function getAllSlugs(): Promise<string[]> {
  const store = await readStore();
  return store.keywords.map((k) => k.slug);
}

/** 키워드 추가 → 슬러그 자동 생성 → 페이지 즉시 활성화 + IndexNow 제출 */
export async function createKeyword(
  input: CreateKeywordInput
): Promise<{
  entry: KeywordEntry;
  indexNow?: Awaited<ReturnType<typeof submitIndexNowForSlug>>;
}> {
  const store = await readStore();
  const existingSlugs = store.keywords.map((k) => k.slug);
  const { slug, suffix } = generateUniqueSlug(input.baseKeyword, existingSlugs);

  const now = new Date().toISOString();
  const baseKeyword = input.baseKeyword.trim();
  const autoSeo = buildAutoSeo(baseKeyword, slug);
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
      ? mixContentForBottom(baseKeyword, slug)
      : (input.content ?? ""),
    useContentMixer,
    mixedImageUrl: mixedImageUrl ?? undefined,
    ogImage: input.ogImage ?? mixedImageUrl ?? undefined,
    tags: input.tags ?? autoSeo.relatedKeywords,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  store.keywords.push(entry);
  await writeStore(store);

  const indexNow = await submitIndexNowForSlug(entry.slug, "create").catch(
    (error) => {
      console.error("[IndexNow] create submit failed:", error);
      return undefined;
    }
  );

  return { entry, indexNow };
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
  const store = await readStore();
  const decoded = decodeURIComponent(slug);
  const index = store.keywords.findIndex((k) => k.slug === decoded);

  if (index === -1) return { entry: null };

  store.keywords[index] = {
    ...store.keywords[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await writeStore(store);
  const updated = store.keywords[index];

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
