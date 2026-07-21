import { seoPipelineDisabledResponse } from "@/lib/seo-pipeline-disabled";

export const dynamic = "force-dynamic";

/** @deprecated SEO 발행은 tools/cafe24-publisher 로 이전됨 */
export async function GET() {
  return seoPipelineDisabledResponse();
}
