import type {
  IndexNowLogEntry,
  IndexNowPayload,
  IndexNowSubmitResult,
  IndexNowTrigger,
} from "@/types/indexnow";
import {
  appendIndexNowLog,
  logIndexNowToConsole,
} from "./indexnow-log";

const DEFAULT_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://searchadvisor.naver.com/indexnow",
];

export interface IndexNowConfig {
  enabled: boolean;
  host: string;
  key: string;
  keyLocation: string;
  canonicalBase: string;
  endpoints: string[];
}

export function getIndexNowConfig(): IndexNowConfig | null {
  const key = process.env.INDEXNOW_KEY?.trim();
  const canonicalBase = (
    process.env.CANONICAL_BASE_URL ?? "https://sub.mydomain.com"
  ).replace(/\/$/, "");

  if (!key) return null;

  const enabled = process.env.INDEXNOW_ENABLED !== "false";
  const host =
    process.env.INDEXNOW_HOST?.trim() ||
    new URL(canonicalBase).hostname;

  const keyLocation =
    process.env.INDEXNOW_KEY_LOCATION?.trim() ||
    `${canonicalBase}/${key}.txt`;

  const endpoints = (
    process.env.INDEXNOW_ENDPOINTS ?? DEFAULT_ENDPOINTS.join(",")
  )
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  return { enabled, host, key, keyLocation, canonicalBase, endpoints };
}

/** 슬러그 → 제출용 전체 URL */
export function buildSubpageUrl(slug: string, canonicalBase?: string): string {
  const base = (canonicalBase ?? getIndexNowConfig()?.canonicalBase ?? "")
    .replace(/\/$/, "");
  return `${base}/${encodeURIComponent(slug)}`;
}

function createLogId(): string {
  return `in-${Date.now().toString(36)}`;
}

async function postToEndpoint(
  endpoint: string,
  payload: IndexNowPayload
): Promise<IndexNowSubmitResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const ok = response.status === 200 || response.status === 202;
    let message: string | undefined;

    if (!ok) {
      const text = await response.text().catch(() => "");
      message = text.slice(0, 200) || response.statusText;
    }

    return { endpoint, ok, statusCode: response.status, message };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { endpoint, ok: false, statusCode: 0, message };
  }
}

function resolveStatus(
  results: IndexNowSubmitResult[]
): IndexNowLogEntry["status"] {
  if (results.length === 0) return "skipped";
  const successCount = results.filter((r) => r.ok).length;
  if (successCount === results.length) return "success";
  if (successCount > 0) return "partial";
  return "failure";
}

/**
 * IndexNow API로 URL 목록 제출 (Naver·Bing 등)
 * @see https://www.indexnow.org/documentation
 */
export async function submitIndexNow(
  urlList: string[],
  trigger: IndexNowTrigger = "manual"
): Promise<IndexNowLogEntry> {
  const config = getIndexNowConfig();

  if (!config?.enabled) {
    const entry: IndexNowLogEntry = {
      id: createLogId(),
      timestamp: new Date().toISOString(),
      trigger,
      host: config?.host ?? "",
      keyLocation: config?.keyLocation ?? "",
      urlList,
      status: "skipped",
      results: [],
      error: config ? "INDEXNOW_ENABLED=false" : "INDEXNOW_KEY 미설정",
    };
    await appendIndexNowLog(entry);
    logIndexNowToConsole(entry);
    return entry;
  }

  if (urlList.length === 0) {
    const entry: IndexNowLogEntry = {
      id: createLogId(),
      timestamp: new Date().toISOString(),
      trigger,
      host: config.host,
      keyLocation: config.keyLocation,
      urlList: [],
      status: "skipped",
      results: [],
      error: "urlList가 비어 있습니다",
    };
    await appendIndexNowLog(entry);
    logIndexNowToConsole(entry);
    return entry;
  }

  const payload: IndexNowPayload = {
    host: config.host,
    key: config.key,
    keyLocation: config.keyLocation,
    urlList,
  };

  const results = await Promise.all(
    config.endpoints.map((endpoint) => postToEndpoint(endpoint, payload))
  );

  const entry: IndexNowLogEntry = {
    id: createLogId(),
    timestamp: new Date().toISOString(),
    trigger,
    host: config.host,
    keyLocation: config.keyLocation,
    urlList,
    status: resolveStatus(results),
    results,
  };

  await appendIndexNowLog(entry);
  logIndexNowToConsole(entry);
  return entry;
}

/** 키워드 슬러그 기준 IndexNow 제출 */
export async function submitIndexNowForSlug(
  slug: string,
  trigger: IndexNowTrigger
): Promise<IndexNowLogEntry> {
  const config = getIndexNowConfig();
  const url = buildSubpageUrl(slug, config?.canonicalBase);
  return submitIndexNow([url], trigger);
}

/** 키워드 등록·업데이트 후 비동기 트리거 */
export function triggerIndexNowForSlug(
  slug: string,
  trigger: IndexNowTrigger
): void {
  submitIndexNowForSlug(slug, trigger).catch((error) => {
    console.error("[IndexNow] trigger failed:", error);
  });
}
