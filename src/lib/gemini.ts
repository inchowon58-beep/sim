import type { SiteConfig } from "./site-config-types";
import type { SeoFaq } from "./data";
import {
  buildSeoCorePhrase,
  extractServicePhrase,
  generateVariedSeoTitle,
  normalizeSeoKeyword,
  polishSeoHtmlContent,
  polishSeoText,
  extractRegionForKeyword,
} from "./seo-keyword";

interface GenerateOptions {
  keyword: string;
  apiKey: string;
  site: SiteConfig;
}

export interface GeneratedSeoContent {
  title: string;
  description: string;
  content: string;
  slug?: string;
  faqs: SeoFaq[];
}

const CONTENT_RULES = `
작성 조건:
- 키워드를 자연스럽게 본문 전체에 5~8회 포함
- 업체명·전화번호는 반드시 {{brandName}}, {{phone}} 등 토큰으로만 표기 (직접 입력 금지)
- 강아지파양, 고양이파양, 강아지무료분양, 고양이무료분양, 파양 입소, 무료입양 관점으로 작성
- 후원, 봉사, 구조, 유기, 유실, 비영리 보호단체, 임시보호 표현 사용 금지
- 견적이라는 단어 사용 금지 (입소 비용, 비용 안내 등으로 표현)
- 파양 = 가정에서 키우던 아이를 더 이상 함께할 수 없을 때 맡기는 것 (이민, 이사, 군입대, 알러지 등)
- 무료분양 = 가정견·가정묘가 새 가족을 찾는 것
- 입소 비용은 사설 보호소 특성상 발생하며, 현실적·투명한 비용 안내 강조
- 신뢰감 있는 전문가 톤, 허위·과장 금지. 수치(상담 건수, 만족도 등)로 신뢰감 표현
- h2, h3, p, ul 태그만 사용 (img 태그 직접 사용 금지)
- 본문 순수 텍스트 기준 **2800자 이상** (짧으면 안 됨)
- h2 섹션 **최소 5개**, 각 섹션마다 p 2~3문단 또는 ul 목록 포함
- 이미지는 시스템에서 본문에 자동 삽입되므로 img 태그·이미지 플레이스홀더 사용 금지
- 다른 SEO 페이지와 문장·사례·섹션 순서가 겹치지 않게 작성
- 자주 묻는 질문(FAQ) 3개: 키워드와 관련된 실질적 질문과 답변 (답변 2문장 이상, 토큰 사용)
- 제목: 지역명을 두 번 반복하지 말 것
- 제목: 다른 페이지와 같은 패턴·같은 문장 구조 금지
- 제목: {{brandName}}·상호명은 제목에 넣지 말 것 (시스템이 자동 추가)
- 제목: 반드시 지역명 1회 포함 (지역 맥락이 있을 때)
- 본문 h2/h3: 지역명 2회 연속 금지
`;

const WRITING_ANGLES = [
  "파양 보호자 관점에서 입소 절차·비용·케어를 중심으로",
  "무료분양 희망자 관점에서 매칭·상담·사후 관리를 중심으로",
  "이민·이사·군입대 등 파양 사유별 맞춤 안내를 중심으로",
  "입소 비용 투명성과 올바른 보호소 선택 기준을 중심으로",
  "강아지·고양이 무료입양 절차와 준비 사항을 중심으로",
  "프리미엄 요양보육 환경과 케어 프로그램을 중심으로",
];

const TITLE_STYLE_HINTS = [
  "파양 입소 상담 강조형",
  "무료분양·무료입양 강조형",
  "입소 비용 투명 안내형",
  "지역 파양·분양 안내형",
  "가정견·가정묘 파양형",
  "책임 매칭·사후 관리형",
  "프리미엄 요양보육 강조형",
  "이민·이사·군입대 파양형",
];

function hashKeyword(keyword: string): number {
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = (hash << 5) - hash + keyword.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickAngle(keyword: string): string {
  const idx = hashKeyword(keyword) % WRITING_ANGLES.length;
  return WRITING_ANGLES[idx];
}

export async function generateSeoContent({
  keyword: rawKeyword,
  apiKey,
  site,
}: GenerateOptions): Promise<GeneratedSeoContent> {
  const keyword = normalizeSeoKeyword(rawKeyword);
  const corePhrase = buildSeoCorePhrase(keyword);

  if (!apiKey) {
    return generateFallbackContent(keyword, site);
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const region = extractRegionForKeyword(keyword);
  const angle = pickAngle(keyword);
  const uniqueSeed = `${keyword}-${hashKeyword(keyword)}`;
  const titleStyleHint =
    TITLE_STYLE_HINTS[hashKeyword(keyword + "style") % TITLE_STYLE_HINTS.length];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 1.1,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `당신은 강아지·고양이 파양·무료분양 SEO 전문 작가입니다. 네이버 검색 최적화를 고려하여 한국어 HTML 콘텐츠를 작성하세요.

센터 정보 (본문에 아래 토큰을 그대로 사용하세요):
- 상호: {{brandName}} ({{companyName}})
- 대표: {{representative}}
- 연락처: {{phone}}
- 입소 비용 안내: {{supportBase}}, {{supportExtra}}, {{supportMax}}
- 특징: 강아지·고양이 파양 입소, 무료분양·무료입양 매칭, 투명한 입소 비용, 입양 전·후 상담

키워드: "${corePhrase}"
(원본 입력: "${keyword}" — 지역명은 한 번만 사용)
${region ? `지역 맥락: ${region} 지역 파양·무료분양 (제목·본문에 "${region} ${region}"처럼 두 번 쓰지 말 것)` : ""}
제목 작성 스타일: ${titleStyleHint}
작성 관점: ${angle}
고유 시드(다른 글과 중복 금지): ${uniqueSeed}

중요: 이전에 작성한 다른 키워드 페이지와 동일한 문장·구조·사례·제목 패턴을 재사용하지 마세요. 키워드와 지역에 맞는 구체적인 상황을 새로 작성하세요.
${CONTENT_RULES}

JSON 형식으로만 응답:
{
  "title": "55자 이내 SEO 제목 — 지역 1회, 상호명·| 구분자 없이, 매번 다른 문장 구조",
  "description": "150자 이내 메타 설명 (토큰 사용 가능)",
  "slug": "영문 소문자 URL slug",
  "content": "HTML 본문",
  "faqs": [
    { "question": "질문1", "answer": "답변1" },
    { "question": "질문2", "answer": "답변2" },
    { "question": "질문3", "answer": "답변3" }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid response");

    const parsed = JSON.parse(jsonMatch[0]) as {
      title: string;
      description: string;
      content: string;
      slug?: string;
      faqs?: SeoFaq[];
    };

    if (!parsed.content || parsed.content.length < 800) {
      throw new Error("Content too short");
    }

    return {
      title: generateVariedSeoTitle(keyword, region, parsed.title),
      description: polishSeoText(parsed.description, region),
      content: polishSeoHtmlContent(parsed.content, keyword),
      slug: parsed.slug,
      faqs: normalizeFaqs(parsed.faqs, keyword, site),
    };
  } catch {
    return generateFallbackContent(keyword, site);
  }
}

function normalizeFaqs(
  faqs: SeoFaq[] | undefined,
  keyword: string,
  site: SiteConfig
): SeoFaq[] {
  const valid = (faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
  if (valid.length >= 3) return valid.slice(0, 3);
  return buildDefaultFaqs(keyword, site);
}

export function buildDefaultFaqs(keyword: string, site: SiteConfig): SeoFaq[] {
  const region = extractRegionForKeyword(keyword);
  const regionNote = region ? `${region} 지역 ` : "";

  const faqSets: SeoFaq[][] = [
    [
      {
        question: `${keyword} 파양 입소 절차는 어떻게 되나요?`,
        answer: `전화·상담 후 센터 방문, 입소 비용 확인, 건강검진과 함께 입소가 진행됩니다. {{brandName}}은 입소 전·후 상담을 지원하며, {{phone}}로 예약할 수 있습니다.`,
      },
      {
        question: `${keyword} 입소 비용은 얼마인가요?`,
        answer: `모든 사설 보호소에는 관리 비용이 발생합니다. {{brandName}}은 {{supportBase}}, {{supportExtra}}, {{supportMax}} 등 항목별로 투명하게 안내합니다.`,
      },
      {
        question: `${keyword} 상담은 어떻게 하나요?`,
        answer: `전화 {{phone}} 또는 홈페이지 문의 폼으로 연락주시면 파양·무료분양·입양 상담을 도와드립니다. 센터 방문은 사전 예약제입니다.`,
      },
    ],
    [
      {
        question: `${regionNote}${keyword} 무료분양은 어떻게 진행되나요?`,
        answer: `{{brandName}}은 가정에서 키우던 아이들의 무료분양·무료입양 매칭을 진행합니다. 신원 확인과 심층 상담 후 적합한 가족을 연결합니다.`,
      },
      {
        question: `이민·이사·군입대로 파양이 필요한데 가능한가요?`,
        answer: `네, 피치 못한 사정으로 더 이상 함께하기 어려운 경우 파양 입소 상담을 받으실 수 있습니다. {{phone}}로 사유와 아이 정보를 알려주세요.`,
      },
      {
        question: `입소 후 아이 소식을 받을 수 있나요?`,
        answer: `{{brandName}}은 입소된 아이의 생활 사진과 건강 상태를 정기적으로 공유합니다. 방문 미팅도 환영합니다.`,
      },
    ],
    [
      {
        question: `${keyword} 무료입양 전 준비할 것은?`,
        answer: `생활 환경, 가족 구성, 반려 경험 등을 상담 시 알려주시면 맞는 아이를 추천해 드립니다. {{brandName}}이 입양 전 체크리스트를 안내합니다.`,
      },
      {
        question: `처음 입양인데 괜찮을까요?`,
        answer: `{{brandName}}은 입양 초보 가정을 위한 상담과 사후 관리를 제공합니다. 궁금한 점은 {{phone}}로 편하게 문의하세요.`,
      },
      {
        question: `센터 방문은 예약이 필요한가요?`,
        answer: `네, 아이들의 안정적인 케어를 위해 사전 예약제로 운영합니다. {{phone}}로 방문 일정을 잡아 주세요.`,
      },
    ],
  ];

  const idx = hashKeyword(keyword) % faqSets.length;
  return faqSets[idx];
}

type FallbackBuilder = (keyword: string, region: string | null) => string;

const FALLBACK_VARIANTS: FallbackBuilder[] = [
  (keyword, region) => {
    const core = buildSeoCorePhrase(keyword);
    return `
<h2>${core} — {{brandName}} 안내</h2>
<p>{{companyName}} {{brandName}}은 ${region ? `${region} 및 ` : ""}전국에서 강아지·고양이 파양 입소와 무료분양·무료입양 매칭을 진행합니다. ${core}에 관심 있으신 분들의 문의를 환영합니다.</p>
<p>대표 {{representative}}와 전문 팀이 파양견·파양묘 입소·케어·분양 매칭·사후 상담까지 함께합니다. {{phone}}로 분양·입양 상담을 예약해 주세요.</p>

<h2>${keyword} 파양·입소 절차</h2>
<ul>
<li>1단계: 전화·상담 — 파양 사유와 아이 정보 확인</li>
<li>2단계: 센터 방문 — 입소 비용·일정 안내</li>
<li>3단계: 건강검진과 함께 입소·케어 시작</li>
<li>4단계: 무료분양·입양 매칭 및 사후 상담</li>
</ul>

<h2>현실적인 입소 비용 안내</h2>
<p>모든 사설 보호소에는 관리 비용이 발생합니다. {{brandName}}은 {{supportBase}}, {{supportExtra}}, {{supportMax}} 등 항목별로 투명하게 안내하며, 고객이 납득할 수 있는 현실적인 비용만 받습니다.</p>

<h2>${keyword} 상담 문의</h2>
<p>전화 {{phone}} · {{brandName}}. 센터 방문은 사전 예약제입니다.</p>`.trim();
  },
  (keyword, region) => {
    const area = region || "지역";
    return `
<h2>${area} 강아지·고양이 파양 — {{brandName}}</h2>
<p>{{brandName}}은 ${keyword} 관련 파양 입소, 무료분양·무료입양 매칭 문의를 받고 있습니다. 이민, 이사, 군입대, 알러지 등 다양한 파양 사유를 이해하고 돕습니다.</p>
<p>파양을 처음 고민하시는 분도 {{phone}} 상담을 통해 단계별 안내를 받으실 수 있습니다.</p>

<h2>센터 특별함</h2>
<ul>
<li>과밀 수용 없는 쾌적한 환경</li>
<li>건강검진·케어·생활 사진 정기 공유</li>
<li>신원 확인·심층 상담 기반 매칭</li>
<li>입양·분양 후 사후 관리</li>
</ul>

<h2>${keyword} 자주 묻는 내용</h2>
<p>입소 비용, 방문 예약, 무료분양 조건 등은 상담 시 자세히 안내해 드립니다. {{companyName}} {{brandName}}에 문의해 주세요.</p>`.trim();
  },
];

function generateFallbackContent(
  keyword: string,
  site: SiteConfig
): GeneratedSeoContent {
  const region = extractRegionForKeyword(keyword);
  const variantIdx = hashKeyword(keyword) % FALLBACK_VARIANTS.length;
  const content = FALLBACK_VARIANTS[variantIdx](keyword, region);

  const titleVariants = [
    (k: string, r: string | null) => generateVariedSeoTitle(k, r),
    (k: string, r: string | null) =>
      generateVariedSeoTitle(k, r, `${extractServicePhrase(k, r)} 입소 안내`),
    (k: string, r: string | null) =>
      generateVariedSeoTitle(k, r, `${extractServicePhrase(k, r)} 무료분양`),
    (k: string, r: string | null) =>
      generateVariedSeoTitle(k, r, `${extractServicePhrase(k, r)} — 입소 안내`),
  ];
  const descVariants = [
    (k: string, r: string | null) =>
      `${buildSeoCorePhrase(k)} 파양·무료분양 상담. {{brandName}}에서 투명한 입소와 책임 매칭을 진행합니다.`,
    (k: string, r: string | null) =>
      `${r ? `${r} ` : ""}${extractServicePhrase(k, r)} 전문 안내. {{brandName}} 강아지·고양이 파양·무료입양.`,
    (k: string) =>
      `{{brandName}} ${buildSeoCorePhrase(k)} — 파양 입소·무료분양. 전화 {{phone}} 상담.`,
    (k: string) =>
      `${buildSeoCorePhrase(k)} 입소 비용·분양 안내. {{brandName}} 프리미엄 요양보육 센터.`,
  ];

  const tIdx = hashKeyword(keyword + "t") % titleVariants.length;
  const dIdx = hashKeyword(keyword + "d") % descVariants.length;

  return {
    title: titleVariants[tIdx](keyword, region),
    description: polishSeoText(descVariants[dIdx](keyword, region), region),
    content: polishSeoHtmlContent(content, keyword),
    faqs: buildDefaultFaqs(keyword, site),
  };
}
