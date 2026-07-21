import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

export const dynamic = "force-dynamic";

/** @deprecated 네이버 서치어드바이저 등록 워커 연동 종료 */
export async function GET() {
  return seoPipelineDisabledResponse();
}
