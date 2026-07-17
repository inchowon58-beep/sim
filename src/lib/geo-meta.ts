/** 지역명 → 네이버/검색용 geo 메타 (대략 좌표) */
const REGION_GEO: Record<
  string,
  { region: string; placename: string; lat: number; lng: number }
> = {
  서울: { region: "KR-11", placename: "서울", lat: 37.5665, lng: 126.978 },
  부산: { region: "KR-26", placename: "부산", lat: 35.1796, lng: 129.0756 },
  대구: { region: "KR-27", placename: "대구", lat: 35.8714, lng: 128.6014 },
  인천: { region: "KR-28", placename: "인천", lat: 37.4563, lng: 126.7052 },
  광주: { region: "KR-29", placename: "광주", lat: 35.1595, lng: 126.8526 },
  대전: { region: "KR-30", placename: "대전", lat: 36.3504, lng: 127.3845 },
  울산: { region: "KR-31", placename: "울산", lat: 35.5384, lng: 129.3114 },
  세종: { region: "KR-50", placename: "세종", lat: 36.4801, lng: 127.289 },
  경기: { region: "KR-41", placename: "경기도", lat: 37.4138, lng: 127.5183 },
  강원: { region: "KR-42", placename: "강원도", lat: 37.8228, lng: 128.1555 },
  충북: { region: "KR-43", placename: "충청북도", lat: 36.6357, lng: 127.4917 },
  충남: { region: "KR-44", placename: "충청남도", lat: 36.5184, lng: 126.8 },
  전북: { region: "KR-45", placename: "전북특별자치도", lat: 35.7175, lng: 127.153 },
  전남: { region: "KR-46", placename: "전라남도", lat: 34.8161, lng: 126.4629 },
  경북: { region: "KR-47", placename: "경상북도", lat: 36.576, lng: 128.5056 },
  경남: { region: "KR-48", placename: "경상남도", lat: 35.4606, lng: 128.2132 },
  제주: { region: "KR-49", placename: "제주", lat: 33.4996, lng: 126.5312 },
  수원: { region: "KR-41", placename: "수원", lat: 37.2636, lng: 127.0286 },
  성남: { region: "KR-41", placename: "성남", lat: 37.4201, lng: 127.1262 },
  부천: { region: "KR-41", placename: "부천", lat: 37.5034, lng: 126.766 },
  고양: { region: "KR-41", placename: "고양", lat: 37.6584, lng: 126.832 },
  용인: { region: "KR-41", placename: "용인", lat: 37.2411, lng: 127.1776 },
  화성: { region: "KR-41", placename: "화성", lat: 37.1995, lng: 126.8312 },
  김포: { region: "KR-41", placename: "김포", lat: 37.6153, lng: 126.7155 },
  안양: { region: "KR-41", placename: "안양", lat: 37.3943, lng: 126.9568 },
  평택: { region: "KR-41", placename: "평택", lat: 36.9921, lng: 127.1129 },
  원주: { region: "KR-42", placename: "원주", lat: 37.3422, lng: 127.9202 },
  강남: { region: "KR-11", placename: "서울 강남", lat: 37.4979, lng: 127.0276 },
  광진: { region: "KR-11", placename: "서울 광진", lat: 37.5384, lng: 127.0822 },
  부평: { region: "KR-28", placename: "인천 부평", lat: 37.5074, lng: 126.7218 },
};

const DEFAULT_GEO = {
  region: "KR",
  placename: "대한민국",
  lat: 37.5665,
  lng: 126.978,
};

export interface GeoMetaTags {
  "geo.region": string;
  "geo.placename": string;
  "geo.position": string;
  ICBM: string;
}

export function resolveGeoMeta(regionHint?: string | null): GeoMetaTags {
  const key = String(regionHint || "").trim();
  const found =
    (key && REGION_GEO[key]) ||
    Object.entries(REGION_GEO).find(([name]) => key.includes(name))?.[1] ||
    DEFAULT_GEO;

  return {
    "geo.region": found.region,
    "geo.placename": found.placename,
    "geo.position": `${found.lat};${found.lng}`,
    ICBM: `${found.lat}, ${found.lng}`,
  };
}
