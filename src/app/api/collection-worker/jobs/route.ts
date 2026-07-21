import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

export const dynamic = "force-dynamic";

/** @deprecated 네이버 웹문서 수집 워커 연동 종료 */
export async function GET() {
  return seoPipelineDisabledResponse();
}

export async function POST() {
  return seoPipelineDisabledResponse();
}
