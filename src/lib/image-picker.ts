import fs from "fs/promises";
import path from "path";
import { createSeededRandom, pickOne } from "./seeded-random";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
  ".svg",
]);

export interface ImageAssetsConfig {
  localDir: string;
  publicBasePath: string;
  externalBaseUrl?: string;
  manifestPath?: string;
}

let cachedScan: { urls: string[]; scannedAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export function getImageAssetsConfig(): ImageAssetsConfig {
  const localDir = process.env.IMAGE_ASSETS_DIR ?? "public/assets/images";
  const publicBasePath =
    process.env.IMAGE_ASSETS_PUBLIC_PATH ?? "/assets/images";
  const externalBaseUrl = process.env.IMAGE_ASSETS_BASE_URL?.replace(/\/$/, "");
  const manifestPath = process.env.IMAGE_ASSETS_MANIFEST;

  return { localDir, publicBasePath, externalBaseUrl, manifestPath };
}

async function readManifestUrls(manifestPath: string): Promise<string[]> {
  try {
    const abs = path.isAbsolute(manifestPath)
      ? manifestPath
      : path.join(process.cwd(), manifestPath);
    const raw = await fs.readFile(abs, "utf-8");
    const data = JSON.parse(raw) as string[] | { images: string[] };
    return Array.isArray(data) ? data : (data.images ?? []);
  } catch {
    return [];
  }
}

async function scanLocalImages(config: ImageAssetsConfig): Promise<string[]> {
  const absDir = path.isAbsolute(config.localDir)
    ? config.localDir
    : path.join(process.cwd(), config.localDir);

  try {
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) =>
        IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase())
      );

    return files.map((filename) => {
      if (config.externalBaseUrl) {
        return `${config.externalBaseUrl}/${encodeURIComponent(filename)}`;
      }
      const base = config.publicBasePath.replace(/\/$/, "");
      return `${base}/${encodeURIComponent(filename)}`;
    });
  } catch {
    return [];
  }
}

/** 이미지 에셋 폴더·매니페스트 스캔 */
export async function scanImageAssets(): Promise<string[]> {
  const now = Date.now();
  if (cachedScan && now - cachedScan.scannedAt < CACHE_TTL_MS) {
    return cachedScan.urls;
  }

  const config = getImageAssetsConfig();
  const localUrls = await scanLocalImages(config);
  const manifestUrls = config.manifestPath
    ? await readManifestUrls(config.manifestPath)
    : [];

  const urls = [...new Set([...localUrls, ...manifestUrls])];
  cachedScan = { urls, scannedAt: now };
  return urls;
}

/** slug 시드 기반 결정론적 랜덤 이미지 선택 */
export async function pickRandomImage(seed: string): Promise<string | null> {
  const urls = await scanImageAssets();
  if (urls.length === 0) return null;

  const rng = createSeededRandom(`img:${seed}`);
  return pickOne(rng, urls);
}

/** HTML 본문 상단에 삽입할 hero 이미지 태그 */
export function buildHeroImageHtml(src: string, alt: string): string {
  return `<figure class="subpage-hero">
  <img class="subpage-hero-image" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async" />
</figure>`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function injectImageIntoContent(
  contentHtml: string,
  imageSrc: string,
  alt: string
): string {
  const figure = buildHeroImageHtml(imageSrc, alt);
  return `${figure}\n${contentHtml}`;
}
