import fs from "fs/promises";
import path from "path";
import type { IndexNowLogEntry } from "@/types/indexnow";

const LOG_PATH = path.join(process.cwd(), "data", "indexnow-logs.json");
const MAX_LOG_ENTRIES = 500;

async function readLogs(): Promise<IndexNowLogEntry[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf-8");
    return JSON.parse(raw) as IndexNowLogEntry[];
  } catch {
    return [];
  }
}

async function writeLogs(logs: IndexNowLogEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.writeFile(LOG_PATH, JSON.stringify(logs, null, 2), "utf-8");
}

export async function appendIndexNowLog(
  entry: IndexNowLogEntry
): Promise<IndexNowLogEntry> {
  const logs = await readLogs();
  logs.unshift(entry);

  if (logs.length > MAX_LOG_ENTRIES) {
    logs.length = MAX_LOG_ENTRIES;
  }

  await writeLogs(logs);
  return entry;
}

export async function getIndexNowLogs(limit = 50): Promise<IndexNowLogEntry[]> {
  const logs = await readLogs();
  return logs.slice(0, limit);
}

export function logIndexNowToConsole(entry: IndexNowLogEntry): void {
  const prefix = `[IndexNow][${entry.status}]`;
  const urls = entry.urlList.join(", ");
  console.log(`${prefix} ${entry.trigger} → ${urls}`);

  for (const result of entry.results) {
    const mark = result.ok ? "✓" : "✗";
    console.log(
      `  ${mark} ${result.endpoint} (${result.statusCode})${result.message ? `: ${result.message}` : ""}`
    );
  }

  if (entry.error) {
    console.error(`  error: ${entry.error}`);
  }
}
