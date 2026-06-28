import fs from "fs/promises";
import path from "path";
import { get, list, put } from "@vercel/blob";

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

function blobAccessOptions() {
  const token = resolveBlobToken();
  const storeId = process.env.BLOB_STORE_ID?.trim();
  const oidcToken = process.env.VERCEL_OIDC_TOKEN?.trim();

  return {
    access: "private" as const,
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
    ...(oidcToken && storeId && !token ? { oidcToken } : {}),
  };
}

function blobPutOptions() {
  return {
    ...blobAccessOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  };
}

async function readFromBlob(fileName: string): Promise<string | null> {
  const pathname = blobPathname(fileName);
  const opts = blobAccessOptions();

  try {
    const result = await get(pathname, opts);
    if (result?.statusCode === 200 && result.stream) {
      return await new Response(result.stream).text();
    }
  } catch (error) {
    console.error(`[data-store] get failed for ${pathname}:`, error);
  }

  try {
    const { blobs } = await list({ prefix: `${BLOB_PREFIX}/`, ...opts });
    const match = blobs.find(
      (b) =>
        b.pathname === pathname ||
        b.pathname.endsWith(`/${fileName}`) ||
        b.pathname === fileName
    );

    if (!match) return null;

    const result = await get(match.pathname, opts);
    if (result?.statusCode === 200 && result.stream) {
      return await new Response(result.stream).text();
    }
  } catch (error) {
    console.error(`[data-store] list/get failed for ${fileName}:`, error);
  }

  return null;
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

/** Blob → 로컬 파일 → seed 순으로 JSON 배열 로드 (seed로 Blob 덮어쓰지 않음) */
export async function readJsonArray<T>(
  relativePath: string,
  seed: T[]
): Promise<T[]> {
  const fileName = path.basename(relativePath);

  const blobRaw = await readFromBlob(fileName);
  if (blobRaw) {
    return parseJsonArray(blobRaw, seed);
  }

  if (!isVercelRuntime()) {
    const fsRaw = await readFromFilesystem(relativePath);
    if (fsRaw) {
      return parseJsonArray(fsRaw, seed);
    }
  }

  return [...seed];
}

function parseJsonObject<T extends object>(raw: string, seed: T): T {
  const parsed = JSON.parse(raw) as unknown;
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as T;
  }
  return { ...seed };
}

/** Blob → 로컬 파일 → seed 순으로 JSON 객체 로드 */
export async function readJsonObject<T extends object>(
  relativePath: string,
  seed: T
): Promise<T> {
  const fileName = path.basename(relativePath);

  const blobRaw = await readFromBlob(fileName);
  if (blobRaw) {
    return parseJsonObject(blobRaw, seed);
  }

  if (!isVercelRuntime()) {
    const fsRaw = await readFromFilesystem(relativePath);
    if (fsRaw) {
      return parseJsonObject(fsRaw, seed);
    }
  }

  return { ...seed };
}

/** Vercel: Blob 필수 / 로컬: 파일시스템 — 저장 후 읽기 검증 */
export async function writeJsonObject<T extends object>(
  relativePath: string,
  data: T
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

    const verify = await readFromBlob(fileName);
    if (!verify) {
      throw new Error(
        "Blob 저장은 됐지만 읽기에 실패했습니다. BLOB_READ_WRITE_TOKEN을 추가 후 Redeploy 하세요."
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

/** Vercel: Blob 필수 / 로컬: 파일시스템 — 저장 후 읽기 검증 */
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

    const verify = await readFromBlob(fileName);
    if (!verify) {
      throw new Error(
        "Blob 저장은 됐지만 읽기에 실패했습니다. Storage → sim-blob → .env.local 탭에서 BLOB_READ_WRITE_TOKEN을 복사해 Environment Variables에 추가한 뒤 Redeploy 하세요."
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
  readTest: "ok" | "fail" | "skip";
  keywordCount: number | null;
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
    readTest: "skip",
    keywordCount: null,
  };

  if (!isVercelRuntime()) {
    status.writeTest = "ok";
    status.readTest = "ok";
    return status;
  }

  if (!status.ready) {
    status.error = "Blob 토큰 또는 BLOB_STORE_ID가 없습니다.";
    status.writeTest = "fail";
    status.readTest = "fail";
    return status;
  }

  const testPayload = JSON.stringify({
    ok: true,
    at: new Date().toISOString(),
  });

  try {
    await put(`${BLOB_PREFIX}/_healthcheck.json`, testPayload, blobPutOptions());
    status.writeTest = "ok";
  } catch (error) {
    status.writeTest = "fail";
    status.error =
      error instanceof Error ? error.message : "Blob 쓰기 테스트 실패";
    status.readTest = "fail";
    return status;
  }

  try {
    const readBack = await readFromBlob("_healthcheck.json");
    status.readTest = readBack ? "ok" : "fail";
    if (!readBack) {
      status.error =
        "Blob 쓰기는 되지만 읽기가 실패합니다. BLOB_READ_WRITE_TOKEN을 Environment Variables에 추가 후 Redeploy 하세요.";
    }
  } catch (error) {
    status.readTest = "fail";
    status.error =
      error instanceof Error ? error.message : "Blob 읽기 테스트 실패";
  }

  try {
    const keywordsRaw = await readFromBlob("keywords.json");
    if (keywordsRaw) {
      const parsed = JSON.parse(keywordsRaw) as unknown;
      status.keywordCount = Array.isArray(parsed) ? parsed.length : 0;
    } else {
      status.keywordCount = 0;
    }
  } catch {
    status.keywordCount = null;
  }

  return status;
}
