/**
 * Vercel 서버리스 SEO/수집/네이버등록 파이프라인 종료 플래그.
 * 문서 대량 발행은 tools/cafe24-publisher (로컬 Python + 카페24 FTP)로 이전됨.
 */
export const SEO_PIPELINE_DISABLED = true;

export const SEO_PIPELINE_DISABLED_MESSAGE =
  "SEO 개별·대량 등록 및 VM 워커 연동은 종료되었습니다. 문서 발행은 로컬 Python 도구(tools/cafe24-publisher)와 카페24 FTP를 사용하세요.";

export function seoPipelineDisabledResponse() {
  return Response.json(
    {
      error: SEO_PIPELINE_DISABLED_MESSAGE,
      code: "SEO_PIPELINE_DISABLED",
      publisher: "tools/cafe24-publisher",
    },
    { status: 410 }
  );
}
