export type IndexNowTrigger = "create" | "update" | "manual";

export type IndexNowStatus = "success" | "partial" | "failure" | "skipped";

export interface IndexNowSubmitResult {
  endpoint: string;
  ok: boolean;
  statusCode: number;
  message?: string;
}

export interface IndexNowLogEntry {
  id: string;
  timestamp: string;
  trigger: IndexNowTrigger;
  host: string;
  keyLocation: string;
  urlList: string[];
  status: IndexNowStatus;
  results: IndexNowSubmitResult[];
  error?: string;
}

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}
