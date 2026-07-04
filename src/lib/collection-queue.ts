import {
  getCollectionQueue,
  saveCollectionQueue,
  type CollectionJob,
  type CollectionJobStatus,
} from "./data";
import { getSettings } from "./data";
import { getSiteConfig } from "./site-config";
import { guidePageUrl } from "./constants";
import { getSiteUrl } from "./site-url";

export type { CollectionJob, CollectionJobStatus };

export interface CollectionPageStatus {
  pageId: string;
  status: CollectionJobStatus | null;
  pageUrl: string;
  requestedAt: string | null;
  submittedAt: string | null;
  error: string | null;
}

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "").trim();
}

export async function getCollectionSiteUrl(): Promise<string> {
  const [settings, config] = await Promise.all([getSettings(), getSiteConfig()]);
  const fromSettings = settings.collectionSiteUrl?.trim();
  if (fromSettings) return normalizeUrl(fromSettings);
  return normalizeUrl(getSiteUrl(config));
}

export function buildPageAbsoluteUrl(siteUrl: string, slug: string): string {
  return `${normalizeUrl(siteUrl)}${guidePageUrl(slug)}`;
}

function latestJobForPage(jobs: CollectionJob[], pageId: string): CollectionJob | undefined {
  return jobs
    .filter((j) => j.pageId === pageId)
    .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))[0];
}

function isDuplicateJob(job: CollectionJob | undefined): boolean {
  if (!job) return false;
  return job.status === "pending" || job.status === "submitted";
}

export async function getCollectionStatusMap(): Promise<Map<string, CollectionPageStatus>> {
  const queue = await getCollectionQueue();
  const siteUrl = await getCollectionSiteUrl();
  const map = new Map<string, CollectionPageStatus>();

  for (const job of queue.jobs) {
    const existing = map.get(job.pageId);
    if (!existing || (job.requestedAt > (existing.requestedAt || ""))) {
      map.set(job.pageId, {
        pageId: job.pageId,
        status: job.status,
        pageUrl: job.pageUrl,
        requestedAt: job.requestedAt,
        submittedAt: job.submittedAt || null,
        error: job.error || null,
      });
    }
  }

  return map;
}

export async function enqueueCollectionRequest(pageId: string): Promise<{
  ok: boolean;
  message: string;
  job?: CollectionJob;
}> {
  const { getPages } = await import("./data");
  const pages = await getPages();
  const page = pages.find((p) => p.id === pageId);
  if (!page) {
    return { ok: false, message: "페이지를 찾을 수 없습니다." };
  }

  const siteUrl = await getCollectionSiteUrl();
  const pageUrl = buildPageAbsoluteUrl(siteUrl, page.slug);
  const queue = await getCollectionQueue();
  const latest = latestJobForPage(queue.jobs, pageId);

  if (isDuplicateJob(latest)) {
    const label = latest!.status === "submitted" ? "이미 수집요청 완료" : "이미 대기 중";
    return { ok: false, message: `${label}된 URL입니다.` };
  }

  const now = new Date().toISOString();
  const job: CollectionJob = {
    id: `col-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    siteUrl,
    pageUrl,
    pageId: page.id,
    keyword: page.keyword,
    slug: page.slug,
    status: "pending",
    requestedAt: now,
  };

  queue.jobs.push(job);
  queue.updatedAt = now;
  await saveCollectionQueue(queue);

  return { ok: true, message: "순위반영(수집) 대기열에 등록했습니다. VM 프로그램이 가져가 처리합니다.", job };
}

export async function enqueueAllPendingPages(): Promise<{
  added: number;
  skipped: number;
}> {
  const { getPages } = await import("./data");
  const pages = await getPages();
  let added = 0;
  let skipped = 0;

  for (const page of pages) {
    const result = await enqueueCollectionRequest(page.id);
    if (result.ok) added++;
    else skipped++;
  }

  return { added, skipped };
}

export async function getPendingJobsForWorker(siteUrl: string): Promise<CollectionJob[]> {
  const normalized = normalizeUrl(siteUrl);
  const queue = await getCollectionQueue();
  return queue.jobs.filter(
    (j) => normalizeUrl(j.siteUrl) === normalized && j.status === "pending"
  );
}

export async function reportCollectionResults(
  results: { id: string; status: "submitted" | "failed"; error?: string }[]
): Promise<number> {
  const queue = await getCollectionQueue();
  const now = new Date().toISOString();
  let updated = 0;

  for (const result of results) {
    const job = queue.jobs.find((j) => j.id === result.id);
    if (!job || job.status !== "pending") continue;
    job.status = result.status;
    job.submittedAt = now;
    if (result.error) job.error = result.error;
    updated++;
  }

  if (updated > 0) {
    queue.updatedAt = now;
    await saveCollectionQueue(queue);
  }

  return updated;
}

export async function removeCollectionJobsForPage(pageId: string): Promise<void> {
  const queue = await getCollectionQueue();
  const next = queue.jobs.filter((j) => j.pageId !== pageId);
  if (next.length === queue.jobs.length) return;
  queue.jobs = next;
  queue.updatedAt = new Date().toISOString();
  await saveCollectionQueue(queue);
}

export function getWorkerSecretFromEnv(): string {
  return process.env.COLLECTION_WORKER_SECRET?.trim() || "";
}

export async function getWorkerSecret(): Promise<string> {
  const settings = await getSettings();
  return settings.collectionWorkerSecret?.trim() || getWorkerSecretFromEnv();
}

export async function verifyWorkerRequest(request: Request): Promise<boolean> {
  const secret = await getWorkerSecret();
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}
