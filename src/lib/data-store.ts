import fs from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";

const BLOB_PREFIX = "seo-data";

function isVercelRuntime(): boolean {
  return Boolean(process.env.VERCEL);
}

/** sim-blob 등 스토어명별 토큰도 자동 감지 */
export function resolveBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (
      value?.trim() &&
      key.includes("BLOB") &&
      key.endsWith("READ_WRITE_TOKEN")
    ) {
      return value.trim();
    }
  }

  return undefined;
}

function blobPathname(fileName: string): string {
  return `${BLOB_PREFIX}/${fileName}`;
}

function blobPutOptions() {
  const token = resolveBlobToken();
  const storeId = process.env.BLOB_STORE_ID?.trim();

  return {
    access: "public" as const,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

async function readFromBlob(fileName: string): Promise<string | null> {
  try {
    const token = resolveBlobToken();
    const storeId = process.env.BLOB_STORE_ID?.trim();

    const result = await get(blobPathname(fileName), {
      access: "public",
      ...(token ? { token } : {}),
      ...(storeId ? { storeId } : {}),
    });

    if (!result || result.statusCode !== 200) return null;
    return await new Response(result.stream).text();
  } catch {
    return null;
  }
}

async function writeToBlob(fileName: string, content: string): Promise<boolean> {
  try {
    await put(blobPathname(fileName), content, blobPutOptions());
    return true;
  } catch (error) {
    console.error(`[data-store] blob write failed for ${fileName}:`, error);
    return false;
  }
}

async function readFromFilesystem(
  relativePath: string
): Promise<string | null> {
  if (isVercelRuntime()) return null;

  const fileName = path.basename(relativePath);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  for (const filePath of [dataPath, tmpPath]) {
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
  if (isVercelRuntime()) return false;

  const fileName = path.basename(relativePath);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  try {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
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

/** Blob → 로컬 파일 → seed 순으로 JSON 배열 로드 */
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
    if (isVercelRuntime()) {
      await writeToBlob(fileName, JSON.stringify(data, null, 2));
    }
    return data;
  }

  if (isVercelRuntime() && seed.length > 0) {
    await writeToBlob(fileName, JSON.stringify(seed, null, 2));
  }

  return [...seed];
}

/** Vercel: Blob 필수 / 로컬: 파일시스템 */
export async function writeJsonArray<T>(
  relativePath: string,
  data: T[]
): Promise<void> {
  const fileName = path.basename(relativePath);
  const content = JSON.stringify(data, null, 2);

  if (isVercelRuntime()) {
    const blobOk = await writeToBlob(fileName, content);
    if (!blobOk) {
      throw new Error(
        "Vercel Blob 저장 실패. Storage → sim-blob → 프로젝트 연결 후 재배포하세요."
      );
    }
    return;
  }

  const fsOk = await writeToFilesystem(relativePath, content);
  if (!fsOk) {
    const blobOk = await writeToBlob(fileName, content);
    if (!blobOk) {
      throw new Error("데이터 저장에 실패했습니다.");
    }
  }
}

export function isPersistentStorageReady(): boolean {
  if (!isVercelRuntime()) return true;
  return Boolean(resolveBlobToken() || process.env.BLOB_STORE_ID);
}

export interface StorageStatus {
  runtime: "vercel" | "local";
  ready: boolean;
  hasToken: boolean;
  hasStoreId: boolean;
  tokenEnvKey: string | null;
  writeTest: "ok" | "fail" | "skip";
  error?: string;
}

export async function getStorageStatus(): Promise<StorageStatus> {
  const token = resolveBlobToken();
  let tokenEnvKey: string | null = null;

  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    tokenEnvKey = "BLOB_READ_WRITE_TOKEN";
  } else {
    for (const [key, value] of Object.entries(process.env)) {
      if (
        value?.trim() &&
        key.includes("BLOB") &&
        key.endsWith("READ_WRITE_TOKEN")
      ) {
        tokenEnvKey = key;
        break;
      }
    }
  }

  const status: StorageStatus = {
    runtime: isVercelRuntime() ? "vercel" : "local",
    ready: isPersistentStorageReady(),
    hasToken: Boolean(token),
    hasStoreId: Boolean(process.env.BLOB_STORE_ID),
    tokenEnvKey,
    writeTest: "skip",
  };

  if (!isVercelRuntime()) {
    status.writeTest = "ok";
    return status;
  }

  if (!status.ready) {
    status.error = "Blob 토큰 또는 BLOB_STORE_ID가 없습니다.";
    status.writeTest = "fail";
    return status;
  }

  try {
    await put(
      `${BLOB_PREFIX}/_healthcheck.json`,
      JSON.stringify({ ok: true, at: new Date().toISOString() }),
      blobPutOptions()
    );
    status.writeTest = "ok";
  } catch (error) {
    status.writeTest = "fail";
    status.error =
      error instanceof Error ? error.message : "Blob 쓰기 테스트 실패";
  }

  return status;
}
