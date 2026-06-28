import { createSeededRandom, pickUnique, shuffle } from "./seeded-random";
import { extractRegion } from "./seo-auto";

/** 지역별 인근 지역 (경기·서울·인천 중심) */
const NEARBY_MAP: Record<string, string[]> = {
  의정부: ["양주", "동두천", "포천", "구리", "남양주"],
  양주: ["의정부", "동두천", "포천", "구리", "파주"],
  동두천: ["양주", "의정부", "포천", "연천", "파주"],
  포천: ["동두천", "양주", "의정부", "가평", "연천"],
  구리: ["남양주", "하남", "의정부", "서울", "양주"],
  남양주: ["구리", "하남", "의정부", "양평", "서울"],
  하남: ["구리", "남양주", "성남", "광주", "서울"],
  성남: ["하남", "광주", "용인", "서울", "수원"],
  수원: ["용인", "화성", "오산", "안양", "성남"],
  용인: ["수원", "화성", "성남", "광주", "이천"],
  화성: ["수원", "용인", "오산", "안산", "평택"],
  안양: ["수원", "군포", "과천", "서울", "안산"],
  안산: ["시흥", "화성", "안양", "인천", "군포"],
  인천: ["부평", "김포", "시흥", "안산", "서울"],
  부평: ["인천", "김포", "서울", "시흥", "안산"],
  김포: ["부평", "인천", "고양", "파주", "서울"],
  고양: ["파주", "김포", "서울", "의정부", "양주"],
  파주: ["고양", "양주", "동두천", "김포", "연천"],
  광명: ["서울", "안양", "군포", "과천", "부천"],
  부천: ["광명", "서울", "인천", "김포", "안양"],
  평택: ["화성", "안성", "오산", "천안", "수원"],
  서울: ["구리", "하남", "고양", "성남", "안양"],
  강남: ["서울", "성남", "하남", "용인", "광주"],
  노원: ["의정부", "구리", "양주", "서울", "남양주"],
  일산: ["고양", "파주", "김포", "서울", "의정부"],
  분당: ["성남", "하남", "용인", "서울", "광주"],
  천안: ["평택", "아산", "안성", "공주", "수원"],
};

const FALLBACK_POOL = [
  "서울",
  "인천",
  "수원",
  "성남",
  "고양",
  "용인",
  "부천",
  "안산",
  "안양",
  "남양주",
  "화성",
  "평택",
  "의정부",
  "시흥",
  "파주",
  "김포",
  "광명",
  "구리",
  "양주",
  "하남",
];

const NEARBY_COUNT = 5;

function normalizeRegionName(region: string): string {
  return region.replace(/(시|군|구)$/u, "").trim();
}

/** 키워드에서 지역 제외 나머지 (의정부 강아지 분양 → 강아지 분양) */
export function extractKeywordTail(
  keyword: string,
  region: string | null
): string {
  const trimmed = keyword.trim();
  if (!region) {
    const parts = trimmed.split(/\s+/);
    const petIdx = parts.findIndex((p) =>
      /^(강아지|고양이|애견|반려|무료|입양|애완)/.test(p)
    );
    if (petIdx >= 0) return parts.slice(petIdx).join(" ");
    return "강아지 분양";
  }

  const normalized = normalizeRegionName(region);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rest = trimmed
    .replace(new RegExp(`^${escaped}(?:시|군|구)?\\s*`, "u"), "")
    .trim();
  return rest || "강아지 분양";
}

/** slug 시드로 인근 지역 5개 (고정) */
export function pickNearbyRegions(
  baseKeyword: string,
  slug: string,
  count = NEARBY_COUNT
): string[] {
  const region = extractRegion(baseKeyword);
  const rng = createSeededRandom(`nearby:${slug}:${baseKeyword}`);
  const normalized = region ? normalizeRegionName(region) : null;

  let pool: string[] = [];
  if (normalized && NEARBY_MAP[normalized]) {
    pool = [...NEARBY_MAP[normalized]];
  } else if (normalized) {
    pool = FALLBACK_POOL.filter(
      (r) => r !== normalized && !r.startsWith(normalized)
    );
  } else {
    pool = [...FALLBACK_POOL];
  }

  const picked = shuffle(rng, pickUnique(rng, pool, count));
  return picked.slice(0, count);
}

function buildRegionKeyword(region: string, tail: string): string {
  const compactTail = tail.replace(/\s+/g, "");
  return `${region}${compactTail}`;
}

/** 인근지역정보 HTML (하단 SEO 블록용) */
export function buildNearbyRegionsHtml(
  baseKeyword: string,
  slug: string
): string {
  const region = extractRegion(baseKeyword);
  const tail = extractKeywordTail(baseKeyword, region);
  const nearby = pickNearbyRegions(baseKeyword, slug);

  if (nearby.length === 0) return "";

  const centerLabel = region ?? baseKeyword.trim();
  const items = nearby
    .map((near) => {
      const kw = buildRegionKeyword(near, tail);
      return `<li><strong>${near}</strong> — ${kw}, ${near}애견분양, ${near}반려동물분양</li>`;
    })
    .join("\n");

  return `<section class="mixed-section mixed-section--nearby">
  <h2>인근지역정보</h2>
  <p>${centerLabel} 인근에서 ${tail} 정보를 찾으신다면 아래 지역도 함께 확인해 보세요.</p>
  <ul class="seo-nearby-list">
${items}
  </ul>
</section>`;
}
