import fs from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";

const BLOB_PREFIX = "seo-data";

function blobPathname(fileName: string): string {
  return `${BLOB_PREFIX}/${fileName}`;
}

function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readFromBlob(fileName: string): Promise<string | null> {
  if (!hasBlobStorage()) return null;

  try {
    const info = await head(blobPathname(fileName));
    const res = await fetch(info.url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function writeToBlob(fileName: string, content: string): Promise<boolean> {
  if (!hasBlobStorage()) return false;

  try {
    await put(blobPathname(fileName), content, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
    });
    return true;
  } catch (error) {
    console.warn(`[data-store] blob write failed for ${fileName}:`, error);
    return false;
  }
}

async function readFromFilesystem(
  relativePath: string
): Promise<string | null> {
  const fileName = path.basename(relativePath);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  for (const filePath of [tmpPath, dataPath]) {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch {
      continue;
    }
  }

  return null;
}

async function writeToFilesystem(
  relativePath: string,
  content: string
): Promise<boolean> {
  const fileName = path.basename(relativePath);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  try {
    await fs.writeFile(dataPath, content, "utf-8");
    return true;
  } catch {
    /* read-only */
  }

  try {
    await fs.mkdir("/tmp", { recursive: true });
    await fs.writeFile(tmpPath, content, "utf-8");
    return true;
  } catch (error) {
    console.warn(`[data-store] fs write failed for ${relativePath}:`, error);
    return false;
  }
}

function parseJsonArray<T>(raw: string, seed: T[]): T[] {
  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed) ? (parsed as T[]) : seed;
}

/** Blob → 파일시스템 → seed 순으로 JSON 배열 로드 */
export async function readJsonArray<T>(
  relativePath: string,
  seed: T[]
): Promise<T[]> {
  const fileName = path.basename(relativePath);

  const blobRaw = await readFromBlob(fileName);
  if (blobRaw) {
    return parseJsonArray(blobRaw, seed);
  }

  const fsRaw = await readFromFilesystem(relativePath);
  if (fsRaw) {
    const data = parseJsonArray(fsRaw, seed);
    if (hasBlobStorage() && data.length > 0) {
      await writeToBlob(fileName, JSON.stringify(data, null, 2));
    }
    return data;
  }

  if (hasBlobStorage() && seed.length > 0) {
    await writeToBlob(fileName, JSON.stringify(seed, null, 2));
  }

  return [...seed];
}

/** Blob + 파일시스템에 JSON 배열 저장 */
export async function writeJsonArray<T>(
  relativePath: string,
  data: T[]
): Promise<void> {
  const fileName = path.basename(relativePath);
  const content = JSON.stringify(data, null, 2);

  const blobOk = await writeToBlob(fileName, content);
  const fsOk = await writeToFilesystem(relativePath, content);

  if (!blobOk && !fsOk) {
    throw new Error(
      "데이터 저장에 실패했습니다. Vercel Blob 스토어 연결을 확인하세요."
    );
  }
}

export function isPersistentStorageReady(): boolean {
  return hasBlobStorage();
}
