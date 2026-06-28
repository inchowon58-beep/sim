import { createSeededRandom, pickOne, pickUnique, shuffle } from "./seeded-random";
import {
  applyKeywordTemplate,
  getContentSectionPool,
  type ContentSectionTemplate,
} from "./content-sections";
import { buildNearbyRegionsHtml } from "./nearby-regions";

const SECTION_COUNT = 4;

function renderSectionHtml(
  section: ContentSectionTemplate,
  keyword: string,
  rng: () => number
): string {
  const title = applyKeywordTemplate(pickOne(rng, section.titles), keyword);
  const paragraphGroup = pickOne(rng, section.paragraphs);
  const body = paragraphGroup
    .map((p) => applyKeywordTemplate(p, keyword))
    .map((p) => `<p>${p}</p>`)
    .join("\n");

  return `<section class="mixed-section mixed-section--${section.category}">
  <h2>${title}</h2>
  ${body}
</section>`;
}

/**
 * 콘텐츠 믹서 — 섹션 풀에서 4개를 무작위 선택·변형하여 HTML 생성
 * slug 기반 시드로 페이지마다 고유하지만 동일 URL에서는 항상 동일 결과
 */
export function mixContent(keyword: string, slug: string): string {
  const rng = createSeededRandom(`mix:${slug}:${keyword}`);
  const pool = getContentSectionPool();
  const selected = shuffle(rng, pickUnique(rng, pool, SECTION_COUNT));

  const introVariants = [
    `<h1>${keyword} — ${pickOne(rng, ["종합 가이드", "완벽 정리", "핵심 정보", "실용 안내"])}</h1>`,
    `<h1>${pickOne(rng, ["알아두면 좋은", "꼭 확인해야 할", "보호자를 위한"])} ${keyword}</h1>`,
  ];

  const intro = pickOne(rng, introVariants);
  const sections = selected
    .map((section) => renderSectionHtml(section, keyword, rng))
    .join("\n");

  return `${intro}\n<div class="mixed-sections">\n${sections}\n</div>`;
}

/**
 * 하단 SEO 블록용 — h1 없이 섹션만 (상단은 아가펫스토리)
 */
export async function mixContentForBottom(
  keyword: string,
  slug: string
): Promise<string> {
  const rng = createSeededRandom(`mix:${slug}:${keyword}`);
  const pool = getContentSectionPool();
  const selected = shuffle(rng, pickUnique(rng, pool, SECTION_COUNT));

  const intro = `<h2 class="seo-bottom-title">${keyword} 안내</h2>`;
  const sections = selected
    .map((section) => renderSectionHtml(section, keyword, rng))
    .join("\n");
  const nearby = await buildNearbyRegionsHtml(keyword, slug);

  return `${intro}\n<div class="mixed-sections">\n${sections}\n${nearby}\n</div>`;
}
