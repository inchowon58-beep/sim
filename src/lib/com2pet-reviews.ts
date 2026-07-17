/** 컴투펫 입양후기 (/29) — 파양·분양 매칭 사례 */
export type Com2petReviewItem = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
};

export const COM2PET_REVIEW_URL = "https://www.com2petcare.com/29";

/** /29 리스트에서 확인된 입양후기 썸네일 (8건) */
export const COM2PET_REVIEWS: Com2petReviewItem[] = [
  {
    id: "review-1",
    title: "구름이와 함께 한지 삼일 차",
    excerpt: "보호소에서 만난 포메 구름이와 새 가족의 이야기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20240123/f3874fda98a75.jpg",
  },
  {
    id: "review-2",
    title: "수원 입양 후기",
    excerpt: "너무 착하고 이뻐요. 건강하게만 잘 지내다오. 잘 키우겠습니다!",
    imageUrl: "https://cdn.imweb.me/thumbnail/20230405/e6b8677dd1bb8.jpg",
  },
  {
    id: "review-3",
    title: "사랑이(행복이) 입양후기",
    excerpt: "벌써 온 지 5개월. 행복이는 잘 지내고 있습니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20230329/4c19a3e03d946.jpg",
  },
  {
    id: "review-4",
    title: "웰시코기 입양후기",
    excerpt: "새 가족을 만난 웰시코기의 입양 후기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20230106/44405f4db1fbe.jpg",
  },
  {
    id: "review-5",
    title: "코숏 입양후기",
    excerpt: "코리안숏헤어 아이의 입양 후기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20221225/09fbff7dba94c.jpg",
  },
  {
    id: "review-6",
    title: "진도믹스 쿠바 입양후기",
    excerpt: "진도믹스 쿠바가 새 가족과 함께한 이야기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20221221/fa4c6e56d58fb.jpg",
  },
  {
    id: "review-7",
    title: "믹스견 나비 입양후기",
    excerpt: "믹스견 나비가 새 보금자리를 찾은 입양 후기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20221218/7accf9807ce09.jpg",
  },
  {
    id: "review-8",
    title: "진도믹스견 입양후기",
    excerpt: "진도믹스견이 따뜻한 가정으로 입양된 이야기입니다.",
    imageUrl: "https://cdn.imweb.me/thumbnail/20221218/e885d68d2b19a.jpg",
  },
];

function decodeHtml(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** imweb 입양후기 보드 HTML 파싱 */
export function parseCom2petReviews(html: string, max = 8): Com2petReviewItem[] {
  const imgRe =
    /background-image:\s*url\((?:&quot;|"|')?(https:\/\/cdn\.imweb\.me\/thumbnail\/[^)"'&]+)/g;
  const positions: { index: number; url: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = imgRe.exec(html))) {
    const url = decodeHtml(m[1]);
    if (/20260309|20221217\/|thumb_error|20240810|20240808|20240906/.test(url)) continue;
    // UI 아이콘성 20221218 png 다수 제외 — jpg 우선, 부족한 경우만 png 허용은 아래에서
    positions.push({ index: m.index, url });
  }

  const items: Com2petReviewItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < positions.length; i++) {
    const url = positions[i].url;
    if (seen.has(url)) continue;
    // 로고·메뉴 png(20221218 대부분) 스킵하되, 폴백 목록에 있는 jpg는 허용
    if (/\/20221218\/.*\.png$/i.test(url)) continue;

    const start = positions[i].index;
    const end = i + 1 < positions.length ? positions[i + 1].index : start + 2800;
    const slice = html.slice(start, Math.min(end, start + 2800));
    const texts = [...slice.matchAll(/>([^<>]{2,120})</g)]
      .map((x) => decodeHtml(x[1]))
      .filter((t) => /[가-힣]/.test(t) && t.length < 90);

    const title =
      texts.find((t) => /입양|후기|함께|식구/.test(t)) ||
      texts[0] ||
      "입양 후기";
    const excerpt =
      texts.find((t) => t !== title && t.length > 10) ||
      "새 가족을 만난 아이의 이야기입니다.";

    seen.add(url);
    items.push({
      id: `review-${items.length + 1}`,
      title: title.slice(0, 48),
      excerpt: excerpt.slice(0, 90),
      imageUrl: url,
    });
    if (items.length >= max) break;
  }

  return items;
}
