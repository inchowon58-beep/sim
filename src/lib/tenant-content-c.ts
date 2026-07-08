import type { TenantContentData } from "@/types/tenant";

type Rng = () => number;

function pickOne<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

function shuffle<T>(items: T[], rng: Rng): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const HERO_LINE_POOLS: string[][] = [
  ["함께할 수 없을 때,", "버리지 말고", "안전하게 맡기세요."],
  ["이민·이사·군입대,", "아이의 다음 가족을", "함께 찾습니다."],
  ["가정견·가정묘", "파양·무료분양", "전문 상담."],
  ["버리지 않고,", "안전하게", "맡기는 방법."],
];

const HERO_SUBTITLES = [
  "더 이상 함께하기 어려운 상황이라도, 파양견·파양묘를 안전하게 맡기실 수 있습니다. 아가펫보호소는 입소부터 새 가족 매칭까지 현실적인 입소 비용으로 진행합니다.",
  "이민, 유학, 군입대, 이사, 임신·출산, 알러지 발현 등 피치 못한 사정으로 케어가 어려울 때 전문 상담을 받으세요.",
  "가정에서 사랑받던 파양견·파양묘가 새 가족을 만날 수 있도록, 입소부터 분양·입양 매칭까지 책임지고 안내합니다.",
];

function randomResponseMinutes(rng: Rng): number {
  return 3 + Math.floor(rng() * 28);
}

function buildDesignCStats(rng: Rng) {
  const responseMin = randomResponseMinutes(rng);
  const matchingSets = [
    [
      { label: "분양·입양 매칭", value: "3,200", suffix: "+" },
      { label: "새 가족을 만난 아이", value: "2,850", suffix: "+" },
      { label: "입소 만족도", value: "97", suffix: "%" },
    ],
    [
      { label: "무료분양·입양", value: "2,800", suffix: "+" },
      { label: "새 가족 매칭", value: "3,150", suffix: "+" },
      { label: "입소 만족도", value: "96", suffix: "%" },
    ],
    [
      { label: "분양·입양 완료", value: "3,400", suffix: "+" },
      { label: "행복한 새 가족", value: "2,720", suffix: "+" },
      { label: "입소 만족도", value: "98", suffix: "%" },
    ],
  ];
  const base = pickOne(matchingSets, rng);
  return [
    ...base,
    { label: "평균 응답 시간", value: String(responseMin), suffix: "분" },
  ];
}

const MISSION_TITLES = [
  ["가정견·가정묘", "파양·분양", "전문 센터."],
  ["투명한 입소,", "책임 있는", "매칭."],
];

const PROMISES = [
  {
    num: "01",
    title: "현실적인 입소 비용",
    description:
      "모든 사설 보호소에는 관리 비용이 발생합니다. 아가펫보호소는 항목별로 투명하게 안내하며, 고객이 납득할 수 있는 수준의 입소 비용만 받습니다.",
  },
  {
    num: "02",
    title: "아이 중심의 환경",
    description:
      "과밀 수용 없이 고양이·소형견·중대형견 각각에 맞는 넓고 쾌적한 공간에서 케어합니다. 야외 운동과 프라이빗 공간을 병행합니다.",
  },
  {
    num: "03",
    title: "쾌적한 웰빙 케어",
    description:
      "산책, 놀이, 목욕, 미용, 건강검진 등 다양한 프로그램으로 입소 아이가 편안한 일상을 보내도록 관리합니다.",
  },
  {
    num: "04",
    title: "주인의 마음을 생각하는 투명함",
    description:
      "입소된 아이의 생활 사진을 정기적으로 공유합니다. 방문 미팅과 상담을 언제든 환영하며, 파양 보호자의 마음을 존중합니다.",
  },
  {
    num: "05",
    title: "광범위한 분양·입양 매칭",
    description:
      "신원 확인과 심층 상담을 거쳐 아이를 사랑할 수 있는 가족에게 연결합니다. 강아지·고양이 무료분양·무료입양 매칭을 책임집니다.",
  },
  {
    num: "06",
    title: "입양 후 사후 관리",
    description:
      "분양·입양 이후에도 아이의 적응 상태를 확인합니다. 다시 함께하기 어려운 경우에도 끝까지 책임지고 상담합니다.",
  },
];

const PROCESS_C = [
  { step: "1", title: "전화·상담", desc: "파양·무료분양 사유와\n아이 정보를 알려주세요." },
  { step: "2", title: "방문·안내", desc: "예약 후 센터를 방문해\n입소 비용과 일정을 안내받습니다." },
  { step: "3", title: "입소·케어", desc: "건강 검진과 함께\n안전하게 케어를 시작합니다." },
  { step: "4", title: "분양·입양", desc: "적합한 가족을 찾아\n매칭 후 사후 상담을 지원합니다." },
];

const SERVICE_TEMPLATES = [
  {
    title: "강아지 파양",
    description: "가정견 파양 입소 — 이민·이사·군입대·건강 등 사유별 맞춤 상담.",
    tags: ["강아지파양", "가정견"],
  },
  {
    title: "고양이 파양",
    description: "가정묘 파양 입소 — 다묘 가정·알러지·환경 변화 등 상황별 안내.",
    tags: ["고양이파양", "가정묘"],
  },
  {
    title: "강아지 무료분양",
    description: "입소 아이 중 새 가족을 기다리는 강아지 무료분양 매칭.",
    tags: ["강아지무료분양", "무료입양"],
  },
  {
    title: "고양이 무료분양",
    description: "성향·생활 환경을 고려한 고양이 무료분양·입양 상담.",
    tags: ["고양이무료분양", "무료입양"],
  },
];

const SCENARIO_ITEMS = [
  { title: "임신·출산", description: "케어가 어렵거나 반려동물과의 공존이 힘든 경우" },
  { title: "알러지 발현", description: "전에는 없던 반려동물 알러지가 나타난 경우" },
  { title: "이민·유학·군입대", description: "해외 이주·장기 부재로 직접 케어가 불가능한 경우" },
  { title: "이사·환경 변화", description: "반려동물 동반 입주가 어려운 이사·거주 환경 변화" },
  { title: "노령·질병", description: "보호자·반려동물 모두 집중 케어가 필요한 경우" },
  { title: "다견·다묘 갈등", description: "반려동물 간 사회성 문제로 분리·파양이 필요한 경우" },
];

export function pickDesignCExtras(
  rng: Rng,
  region: string,
  siteName: string,
  firstKeyword: string,
  maxImages: number,
  casesItems: NonNullable<TenantContentData["casesItems"]>
): Partial<TenantContentData> {
  const imagePool = shuffle(
    Array.from({ length: maxImages }, (_, i) => i + 1),
    rng
  );

  const businessAreas = SERVICE_TEMPLATES.map((item, i) => ({
    ...item,
    imageIndex: imagePool[i % imagePool.length],
  }));

  const missionLines = pickOne(MISSION_TITLES, rng);

  return {
    heroLines: pickOne(HERO_LINE_POOLS, rng),
    heroSubline: pickOne(HERO_SUBTITLES, rng),
    missionLines,
    missionBody: `${siteName}은 ${region} 및 전국에서 파양견·파양묘 입소와 무료분양·입양 매칭을 진행하는 프리미엄 요양보육 센터입니다. 가정에서 사랑받던 아이들이 새 가족을 만날 수 있도록 투명한 입소 비용과 책임 있는 매칭으로 돕습니다.`,
    storyTitle: ["작은 선택이", "아이의 남은", "평생을 바꿉니다."],
    stats: buildDesignCStats(rng),
    businessAreas,
    casesItems: casesItems.slice(0, 6),
    promises: PROMISES,
    processSteps: PROCESS_C,
    supportBlurb:
      "무료 입소를 내세우는 곳은 방문 후 과도한 비용을 요구하거나 관리가 미흡한 경우가 많습니다. 아가펫보호소는 입소 전 항목별 비용을 투명하게 안내하고, 아이 관리에 필요한 현실적인 비용만 받습니다.",
    heroKeyword: firstKeyword || `${region}강아지파양`,
    scenarioItems: shuffle(SCENARIO_ITEMS, rng).slice(0, 4),
  };
}
