import { readBlobText, writeBlobText, isBlobConfigured } from "@/lib/blob-storage";

export type Com2petAdoptionItem = {
  id: string;
  name: string;
  breed: string;
  branch: string;
  imageUrl: string;
  kind: "dog" | "cat";
};

export type Com2petAdoptionCache = {
  updatedAt: string;
  source: {
    dog: string;
    cat: string;
  };
  dogs: Com2petAdoptionItem[];
  cats: Com2petAdoptionItem[];
};

export const COM2PET_DOG_URL = "https://www.com2petcare.com/23";
export const COM2PET_CAT_URL = "https://www.com2petcare.com/24";
const BLOB_FILE = "com2pet-adoption.json";
const MAX_ITEMS = 12;
const BRANCHES = ["서울점", "인천점", "수원점", "강원원주점"] as const;

/** 동기화 전·실패 시 폴백 (정적 스냅샷) */
export const COM2PET_DOG_ADOPTIONS: Com2petAdoptionItem[] = [
  {
    id: "dog-1",
    name: "솜이",
    breed: "비숑브리제",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260717/4c20a0f36e180.jpg",
    kind: "dog",
  },
  {
    id: "dog-2",
    name: "노을이",
    breed: "골든리트리버",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/807f9467fffd4.jpg",
    kind: "dog",
  },
  {
    id: "dog-3",
    name: "잉크",
    breed: "두들",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/33b1963f8d66b.png",
    kind: "dog",
  },
  {
    id: "dog-4",
    name: "두리",
    breed: "골든두들",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/0038eeecd88d7.jpg",
    kind: "dog",
  },
  {
    id: "dog-5",
    name: "홍삼이",
    breed: "말티즈",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/1011ef2152798.jpg",
    kind: "dog",
  },
  {
    id: "dog-6",
    name: "푸름이",
    breed: "말티푸",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/b9140991fd12b.jpg",
    kind: "dog",
  },
  {
    id: "dog-7",
    name: "루이",
    breed: "골든리트리버",
    branch: "서울점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260714/14612c1b114e6.png",
    kind: "dog",
  },
  {
    id: "dog-8",
    name: "테라",
    breed: "푸들",
    branch: "강원원주점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260714/59017084fdc6a.jpg",
    kind: "dog",
  },
];

export const COM2PET_CAT_ADOPTIONS: Com2petAdoptionItem[] = [
  {
    id: "cat-1",
    name: "호두",
    breed: "코리안숏헤어",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/35240baebeda2.jpg",
    kind: "cat",
  },
  {
    id: "cat-2",
    name: "호떡이",
    breed: "코리안숏헤어",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260716/f7f21310953e8.jpg",
    kind: "cat",
  },
  {
    id: "cat-3",
    name: "루이",
    breed: "코리안숏헤어",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260712/29bc7491ac588.jpg",
    kind: "cat",
  },
  {
    id: "cat-4",
    name: "보름이",
    breed: "브리티쉬숏헤어",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260711/6b88b4fe98a5b.jpg",
    kind: "cat",
  },
  {
    id: "cat-5",
    name: "보리",
    breed: "코리안숏헤어",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260707/91e4b6c6ef0ea.jpg",
    kind: "cat",
  },
  {
    id: "cat-6",
    name: "온유·담이·다온",
    breed: "코리안숏헤어",
    branch: "인천점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260706/e5a6b4961abc3.jpg",
    kind: "cat",
  },
  {
    id: "cat-7",
    name: "스카이",
    breed: "코리안숏헤어",
    branch: "수원점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260703/2c3aa0b2d5158.jpg",
    kind: "cat",
  },
  {
    id: "cat-8",
    name: "일일호박·일이호박",
    breed: "코리안숏헤어",
    branch: "강원원주점",
    imageUrl: "https://cdn.imweb.me/thumbnail/20260629/b06bbd1828bcc.jpg",
    kind: "cat",
  },
];

function fallbackCache(): Com2petAdoptionCache {
  return {
    updatedAt: "",
    source: { dog: COM2PET_DOG_URL, cat: COM2PET_CAT_URL },
    dogs: COM2PET_DOG_ADOPTIONS,
    cats: COM2PET_CAT_ADOPTIONS,
  };
}

function decodeHtml(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseListingTitle(
  raw: string,
  kind: "dog" | "cat"
): { breed: string; name: string } {
  const cleaned = decodeHtml(raw)
    .replace(/강아지책임분양|고양이책임분양/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const parts = cleaned.split(/\s*[_·]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { breed: parts[0], name: parts.slice(1).join(" ") };
  }
  return {
    breed: cleaned || (kind === "dog" ? "강아지" : "고양이"),
    name: cleaned || "책임분양",
  };
}

function findBranch(texts: string[]): string {
  for (const t of texts) {
    const hit = BRANCHES.find((b) => t.includes(b));
    if (hit) return hit;
  }
  const loose = texts.find((t) => /점$/.test(t) && t.length <= 12);
  return loose || "전국";
}

function findTitle(texts: string[], kind: "dog" | "cat"): string | null {
  const keyword = kind === "dog" ? "강아지책임분양" : "고양이책임분양";
  const hit = texts.find((t) => t.includes(keyword) || t.includes("책임분양"));
  return hit || null;
}

/** imweb 보드 HTML에서 썸네일·지점·제목 추출 */
export function parseCom2petListings(
  html: string,
  kind: "dog" | "cat"
): Com2petAdoptionItem[] {
  const imgRe =
    /background-image:\s*url\((?:&quot;|"|')?(https:\/\/cdn\.imweb\.me\/thumbnail\/[^)"'&]+)/g;
  const positions: { index: number; url: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = imgRe.exec(html))) {
    const url = decodeHtml(m[1]);
    // 로고·공통 배너 제외
    if (/20260309\/43681f96130d6|20221218|20221217/.test(url)) continue;
    positions.push({ index: m.index, url });
  }

  const items: Com2petAdoptionItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i].index;
    const end = i + 1 < positions.length ? positions[i + 1].index : start + 2800;
    const slice = html.slice(start, Math.min(end, start + 2800));
    const texts = [...slice.matchAll(/>([^<>]{2,120})</g)]
      .map((x) => decodeHtml(x[1]))
      .filter((t) => /[가-힣]/.test(t) && t.length < 90);

    const titleRaw = findTitle(texts, kind);
    if (!titleRaw) continue;

    const branch = findBranch(texts);
    const { breed, name } = parseListingTitle(titleRaw, kind);
    const key = `${positions[i].url}|${breed}|${name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    items.push({
      id: `${kind}-${items.length + 1}`,
      name,
      breed,
      branch,
      imageUrl: positions[i].url,
      kind,
    });

    if (items.length >= MAX_ITEMS) break;
  }

  return items;
}

async function fetchPageHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AgapetShelterBot/1.0; +https://sim-seven-woad.vercel.app)",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 0 },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`컴투펫 페이지 요청 실패 (${res.status}): ${url}`);
  }
  return res.text();
}

export async function readCom2petAdoptionCache(): Promise<Com2petAdoptionCache | null> {
  if (!isBlobConfigured()) return null;
  try {
    const raw = await readBlobText(BLOB_FILE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Com2petAdoptionCache;
    if (!Array.isArray(parsed.dogs) || !Array.isArray(parsed.cats)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** 메인 표시용 — Blob 캐시 우선, 없으면 정적 폴백 */
export async function getCom2petAdoptionLists(): Promise<{
  dogs: Com2petAdoptionItem[];
  cats: Com2petAdoptionItem[];
  updatedAt: string | null;
  fromCache: boolean;
}> {
  const cached = await readCom2petAdoptionCache();
  if (cached?.dogs?.length && cached?.cats?.length) {
    return {
      dogs: cached.dogs,
      cats: cached.cats,
      updatedAt: cached.updatedAt || null,
      fromCache: true,
    };
  }
  const fb = fallbackCache();
  return {
    dogs: fb.dogs,
    cats: fb.cats,
    updatedAt: null,
    fromCache: false,
  };
}

/** 컴투펫 /23·/24 스크랩 → Blob 저장 */
export async function syncCom2petAdoptions(): Promise<Com2petAdoptionCache> {
  const [dogHtml, catHtml] = await Promise.all([
    fetchPageHtml(COM2PET_DOG_URL),
    fetchPageHtml(COM2PET_CAT_URL),
  ]);

  const dogs = parseCom2petListings(dogHtml, "dog");
  const cats = parseCom2petListings(catHtml, "cat");

  if (!dogs.length && !cats.length) {
    throw new Error("컴투펫 책임분양 목록을 파싱하지 못했습니다.");
  }

  const previous = await readCom2petAdoptionCache();
  const payload: Com2petAdoptionCache = {
    updatedAt: new Date().toISOString(),
    source: { dog: COM2PET_DOG_URL, cat: COM2PET_CAT_URL },
    dogs: dogs.length ? dogs : previous?.dogs?.length ? previous.dogs : COM2PET_DOG_ADOPTIONS,
    cats: cats.length ? cats : previous?.cats?.length ? previous.cats : COM2PET_CAT_ADOPTIONS,
  };

  if (!isBlobConfigured()) {
    throw new Error("BLOB_NOT_CONFIGURED");
  }

  await writeBlobText(BLOB_FILE, JSON.stringify(payload, null, 2));
  return payload;
}
