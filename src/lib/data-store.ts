import fs from "fs/promises";
import path from "path";

/** Vercel 등 read-only 환경에서 /tmp 에 우선 저장·조회 */
export async function readJsonArray<T>(
  relativePath: string,
  seed: T[]
): Promise<T[]> {
  const fileName = path.basename(relativePath);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  for (const filePath of [tmpPath, dataPath]) {
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : seed;
    } catch {
      continue;
    }
  }

  return [...seed];
}

export async function writeJsonArray<T>(
  relativePath: string,
  data: T[]
): Promise<void> {
  const fileName = path.basename(relativePath);
  const content = JSON.stringify(data, null, 2);
  const dataPath = path.join(process.cwd(), relativePath);
  const tmpPath = path.join("/tmp", fileName);

  try {
    await fs.writeFile(dataPath, content, "utf-8");
    return;
  } catch {
    /* read-only — /tmp fallback */
  }

  try {
    await fs.mkdir("/tmp", { recursive: true });
    await fs.writeFile(tmpPath, content, "utf-8");
  } catch (error) {
    console.warn(`[data-store] write failed for ${relativePath}:`, error);
  }
}
