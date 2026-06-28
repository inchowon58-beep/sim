import type { KeywordEntry } from "@/types/keyword";
import { mixContent } from "./content-mixer";
import { injectImageIntoContent, pickRandomImage } from "./image-picker";

export interface DynamicPageContent {
  html: string;
  heroImageUrl: string | null;
}

/**
 * 서브페이지 렌더용 동적 콘텐츠 조립
 * - useContentMixer=true → 섹션 4개 믹스
 * - useContentMixer=false → 저장된 content HTML 사용
 * - 이미지: 슬러그 시드 기반 랜덤 매칭 (mixedImageUrl 우선)
 */
export async function buildDynamicPageContent(
  entry: KeywordEntry
): Promise<DynamicPageContent> {
  const html =
    entry.useContentMixer !== false
      ? mixContent(entry.baseKeyword, entry.slug)
      : entry.content;

  const heroImageUrl =
    entry.mixedImageUrl ?? (await pickRandomImage(entry.slug));

  const finalHtml = heroImageUrl
    ? injectImageIntoContent(html, heroImageUrl, entry.baseKeyword)
    : html;

  return { html: finalHtml, heroImageUrl };
}
