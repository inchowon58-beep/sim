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

function randomResponseMinutes(rng: Rng): number {
  return 3 + Math.floor(rng() * 28);
}

/** E 디자인 전용 이미지·연락처 기본값 */
export const DESIGN_E_IMAGE_CDN = "https://image.cattery.co.kr/com2pet";
export const DESIGN_E_IMAGE_COUNT = 20;
export const DESIGN_E_PHONE = "010-2103-3339";

const HERO_EYEBROWS = [
  "Dog Surrender & Free Adoption",
  "Safe Pet Care Matching",
  "Trusted Pet Placement Center",
];

const ABOUT_POOL = [
  (name: string, region: string) =>
    `${name}는 ${region} 지역을 중심으로 강아지 파양 입소와 무료분양을 전문으로 안내하는 센터입니다. 피치 못할 사정으로 더 이상 함께하기 어려운 아이와, 새 가족을 찾는 보호자를 안전하게 연결합니다.`,
  (name: string, region: string) =>
    `${name}에서는 강아지파양·무료분양 상담을 진행합니다. ${region} 및 인근 지역 보호자님께 입소 절차와 매칭 과정을 투명하게 안내합니다.`,
  (name: string) =>
    `${name}는 가정견 파양 입소부터 무료분양·입양 매칭까지 책임 있게 진행합니다. 이민·이사·군입대 등 다양한 사유에 맞춰 맞춤 상담을 제공합니다.`,
];

const ABOUT_BULLETS = [
  "강아지 파양 입소 상담 — 사유별 맞춤 안내",
  "무료분양·입양 매칭 — 신원 확인 후 안전하게 연결",
  "입소 비용·절차를 사전에 투명하게 안내",
  "입소 후 생활·건강 상태 공유와 사후 상담",
];

const SERVICE_CARDS = [
  {
    title: "강아지 파양",
    englishLabel: "Dog Surrender",
    description:
      "이민·이사·군입대·알러지 등 피치 못한 사정의 가정견 파양 입소를 상담합니다.",
  },
  {
    title: "무료분양",
    englishLabel: "Free Adoption",
    description:
      "입소 아이 중 새 가족을 기다리는 강아지를 무료분양·무료입양으로 연결합니다.",
  },
  {
    title: "파양 입소 안내",
    englishLabel: "Intake Guide",
    description:
      "상담 → 방문 예약 → 입소 비용 확인 → 건강검진·케어까지 절차를 안내합니다.",
  },
  {
    title: "입양 매칭",
    englishLabel: "Matching",
    description:
      "생활 환경과 성향을 고려해 책임 있는 새 보호자와 매칭합니다.",
  },
  {
    title: "입소 케어",
    englishLabel: "Intake Care",
    description:
      "입소 후 목욕·산책·건강 관리 등 아이 중심의 케어를 진행합니다.",
  },
  {
    title: "긴급 상담",
    englishLabel: "Urgent Consult",
    description:
      "출국·이사 등 급한 파양 상황도 신속히 상담·안내합니다.",
  },
];

const GUIDE_ITEMS = [
  {
    title: "상담 신청",
    subtitle: "01 Consult",
    description:
      "전화·온라인으로 파양 입소 또는 입양 상담을 신청합니다.",
  },
  {
    title: "센터 방문 · 방문 픽업",
    subtitle: "02 Visit / Pickup",
    description:
      "사전 예약 후 센터를 방문합니다. 방문이 힘든 경우 담당자가 직접 방문 픽업도 가능합니다.",
  },
  {
    title: "입소·비용 안내",
    subtitle: "03 Intake",
    description:
      "입소 비용과 케어 내용을 투명하게 안내한 뒤 입소를 진행합니다.",
  },
  {
    title: "새 가족 매칭",
    subtitle: "04 Matching",
    description:
      "보호중인 아이와 책임 있는 보호자를 연결하고 사후 상담을 지원합니다.",
  },
];

const FAQ_POOL = [
  {
    question: "강아지 파양 입소는 어떻게 진행되나요?",
    answer:
      "전화·상담 후 센터 방문, 입소 비용 확인, 건강검진과 함께 입소가 진행됩니다. 방문은 사전 예약제입니다.",
  },
  {
    question: "입소 비용은 어떻게 되나요?",
    answer:
      "사설 센터에는 관리 비용이 발생합니다. 입소 전 항목별 비용을 투명하게 안내하며, 현실적인 관리비만 받습니다.",
  },
  {
    question: "무료분양·입양은 어떻게 신청하나요?",
    answer:
      "입소된 강아지 중 새 가족을 기다리는 아이와 연결합니다. 신원 확인과 심층 상담 후 매칭합니다.",
  },
  {
    question: "입소 후 아이 소식을 받을 수 있나요?",
    answer:
      "입소된 아이의 생활 사진과 건강 상태를 정기적으로 공유합니다. 방문 미팅도 가능합니다.",
  },
  {
    question: "이민·이사·군입대로 파양이 필요한데 가능한가요?",
    answer:
      "네, 피치 못한 사정으로 더 이상 함께하기 어려운 경우 파양 입소 상담을 받으실 수 있습니다.",
  },
  {
    question: "입양 후에도 상담이 가능한가요?",
    answer:
      "분양·입양 이후에도 아이의 적응 상태를 확인하며, 사후 상담을 지원합니다.",
  },
];

const REGION_POOL = [
  "서울",
  "부천",
  "인천",
  "수원",
  "성남",
  "안양",
  "고양",
  "용인",
  "화성",
  "김포",
  "의정부",
  "광명",
  "시흥",
  "안산",
  "평택",
  "하남",
];

export function pickDesignEExtras(
  rng: Rng,
  region: string,
  siteName: string,
  firstKeyword: string,
  maxImages: number,
  casesItems: NonNullable<TenantContentData["casesItems"]>
): Partial<TenantContentData> {
  const imagePool = shuffle(
    Array.from({ length: Math.min(maxImages, DESIGN_E_IMAGE_COUNT) }, (_, i) => i + 1),
    rng
  );
  /** 강아지·야외 활동 컷을 앞에 두어 흐린 건물 전경보다 생동감 있게 */
  const vividPreferred = [2, 4, 5, 7, 6, 19, 18, 1];
  const orderedPool = [
    ...vividPreferred.filter((n) => imagePool.includes(n)),
    ...imagePool.filter((n) => !vividPreferred.includes(n)),
  ];
  const responseMin = randomResponseMinutes(rng);
  const aboutFn = pickOne(ABOUT_POOL, rng);

  const serviceCards = SERVICE_CARDS.map((item, i) => ({
    ...item,
    imageIndex: orderedPool[i % orderedPool.length],
  }));

  const aboutFeatures = ABOUT_BULLETS.map((text, i) => ({
    icon: "✓",
    title: text.split("—")[0]?.trim() || text.slice(0, 8),
    description: text,
  }));

  const regionLinks = [
    `${region}강아지파양`,
    `${region}강아지무료분양`,
    ...shuffle(
      REGION_POOL.filter((r) => r !== region),
      rng
    )
      .slice(0, 10)
      .map((r) => `${r}강아지파양`),
  ];

  return {
    imageCdn: DESIGN_E_IMAGE_CDN,
    imageCount: DESIGN_E_IMAGE_COUNT,
    phone: DESIGN_E_PHONE,
    geoRegion: region,
    heroEyebrow: pickOne(HERO_EYEBROWS, rng),
    heroKeyword: firstKeyword || `${region}강아지파양`,
    heroSubline: "강아지 파양 · 무료분양 전문 상담",
    heroImageIndex: 5,
    supportImageIndex: 2,
    aboutText: aboutFn(siteName, region),
    description: `${siteName} | ${region} 강아지파양·무료분양 전문. 파양 입소부터 새 가족 매칭까지 안전하게 안내합니다.`,
    tagline: "강아지 파양 · 무료분양",
    aboutFeatures,
    serviceCards,
    guideItems: GUIDE_ITEMS,
    businessAreas: serviceCards.slice(0, 4).map((c) => ({
      title: c.title,
      description: c.description,
      tags: [c.englishLabel],
      imageIndex: c.imageIndex,
    })),
    faqItems: shuffle(FAQ_POOL, rng).slice(0, 6),
    casesItems: casesItems.slice(0, 12),
    regionLinks,
    trustBadges: ["파양 입소", "무료분양", "투명 안내", "빠른 상담"],
    stats: [
      { label: "분양·입양 매칭", value: "2,800", suffix: "+" },
      { label: "새 가족을 만난 아이", value: "2,400", suffix: "+" },
      { label: "입소 상담 만족", value: "96", suffix: "%" },
      { label: "평균 응답 시간", value: String(responseMin), suffix: "분" },
    ],
  };
}
