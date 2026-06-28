export type SectionCategory =
  | "promo"
  | "feature"
  | "origin"
  | "guide"
  | "tip"
  | "care"
  | "story";

export interface ContentSectionTemplate {
  id: string;
  category: SectionCategory;
  titles: string[];
  paragraphs: string[][];
}

const COMPANY = "아가펫스토리";

function kw(keyword: string) {
  return keyword;
}

/** 콘텐츠 믹서 풀 — 홍보·특징·유래·가이드 등 */
export function getContentSectionPool(): ContentSectionTemplate[] {
  return [
    {
      id: "promo-brand",
      category: "promo",
      titles: [
        `${COMPANY}와 함께하는 반려생활`,
        `${COMPANY}가 추천하는 정보 가이드`,
        `믿을 수 있는 ${COMPANY} 큐레이션`,
      ],
      paragraphs: [
        [
          `${COMPANY}는 반려동물과 보호자가 더 행복한 일상을 만들 수 있도록 검증된 정보를 제공합니다.`,
          `전문가 자문과 실제 사례를 바탕으로 신뢰할 수 있는 콘텐츠만 선별해 안내드립니다.`,
        ],
        [
          `${COMPANY}는 반려동물 복지와 책임 있는 양육 문화 확산을 목표로 운영됩니다.`,
          `정확한 정보 전달을 통해 불필요한 혼란을 줄이고, 현명한 선택을 돕습니다.`,
        ],
      ],
    },
    {
      id: "promo-trust",
      category: "promo",
      titles: [
        `${COMPANY}가 지키는 3가지 약속`,
        `${COMPANY}의 정보 품질 기준`,
      ],
      paragraphs: [
        [
          `첫째, 과장된 표현 없이 사실 중심의 정보를 전달합니다.`,
          `둘째, 최신 트렌드와 수의학적 근거를 함께 반영합니다.`,
          `셋째, 보호자의 상황에 맞는 실용적 조언을 우선합니다.`,
        ],
      ],
    },
    {
      id: "feature-keyword",
      category: "feature",
      titles: [
        `{keyword}의 핵심 특징`,
        `{keyword} — 알아두면 좋은 포인트`,
        `{keyword}를 이해하는 4가지 관점`,
      ],
      paragraphs: [
        [
          `{keyword}는 반려동물과 보호자의 생활 패턴에 따라 접근 방식이 달라질 수 있습니다.`,
          `연령, 품종, 건강 상태, 생활 환경을 종합적으로 고려하는 것이 중요합니다.`,
        ],
        [
          `{keyword}에 대한 관심이 높아지면서 다양한 정보가 혼재하고 있습니다.`,
          `출처가 명확하고 일관된 기준을 갖춘 자료를 참고하시길 권장합니다.`,
        ],
      ],
    },
    {
      id: "origin-etymology",
      category: "origin",
      titles: [
        `{keyword}의 유래와 배경`,
        `{keyword} — 이름과 의미`,
        `{keyword}가 주목받게 된 이유`,
      ],
      paragraphs: [
        [
          `{keyword}는 반려동물 문화가 확산되면서 일상 언어와 검색 수요 모두에서 빈번히 등장하는 주제입니다.`,
          `국내외 사례를 비교하면 지역·문화에 따라 인식과 실천 방식에 차이가 있습니다.`,
        ],
        [
          `과거에는 전문가 중심의 정보 접근이 일반적이었으나, 최근에는 보호자 커뮤니티의 경험 공유도 중요한 참고 자료가 되었습니다.`,
        ],
      ],
    },
    {
      id: "guide-checklist",
      category: "guide",
      titles: [
        `{keyword} 시작 전 체크리스트`,
        `{keyword} 준비 가이드`,
        `{keyword} — 단계별 접근법`,
      ],
      paragraphs: [
        [
          `1단계: 기본 개념과 용어를 정리하고 목표를 명확히 설정하세요.`,
          `2단계: 반려동물의 현재 상태를 기록하고 변화 가능성을 점검하세요.`,
          `3단계: 전문가 상담이 필요한 경우 미리 일정을 잡아두세요.`,
        ],
        [
          `준비물, 예산, 시간 투자 가능 범위를 미리 정리하면 {keyword} 과정에서 불필요한 스트레스를 줄일 수 있습니다.`,
        ],
      ],
    },
    {
      id: "tip-practical",
      category: "tip",
      titles: [
        `{keyword} 실전 팁`,
        `{keyword} — 현장에서 통하는 조언`,
        `보호자가 자주 놓치는 {keyword} 포인트`,
      ],
      paragraphs: [
        [
          `짧은 기록(사진·메모)을 꾸준히 남기면 변화 추이를 파악하기 쉽습니다.`,
          `급격한 변화보다 점진적 적응이 대부분의 경우 더 안전합니다.`,
        ],
        [
          `주변 환경(소음, 온도, 공간)을 함께 조정하면 {keyword} 효과를 높일 수 있습니다.`,
        ],
      ],
    },
    {
      id: "care-wellness",
      category: "care",
      titles: [
        `{keyword}와 함께하는 건강 관리`,
        `{keyword} — 웰니스 관점`,
      ],
      paragraphs: [
        [
          `균형 잡힌 영양, 적절한 운동, 정서적 안정감은 {keyword}와 밀접하게 연결됩니다.`,
          `정기 검진과 예방 관리를 병행하면 장기적인 안녕에 도움이 됩니다.`,
        ],
      ],
    },
    {
      id: "story-community",
      category: "story",
      titles: [
        `{keyword} — 보호자들의 이야기`,
        `커뮤니티에서 배우는 {keyword}`,
      ],
      paragraphs: [
        [
          `다양한 보호자의 경험담은 {keyword}에 대한 이해를 넓혀 줍니다.`,
          `${COMPANY}는 검증된 후기와 전문가 코멘트를 함께 제공해 균형 잡힌 시각을 돕습니다.`,
        ],
        [
          `비슷한 고민을 가진 보호자들과 정보를 나누면 시행착오를 줄이고 자신감을 높일 수 있습니다.`,
        ],
      ],
    },
    {
      id: "feature-comparison",
      category: "feature",
      titles: [
        `{keyword} 선택 시 비교 항목`,
        `{keyword} — 옵션별 장단점`,
      ],
      paragraphs: [
        [
          `비용, 접근성, 유지 관리 난이도, 반려동물의 반응 등을 표로 정리해 비교해 보세요.`,
          `단기적 편의보다 장기적 안정성을 기준으로 판단하는 것이 바람직합니다.`,
        ],
      ],
    },
    {
      id: "origin-trend",
      category: "origin",
      titles: [
        `{keyword} 트렌드 흐름`,
        `{keyword} — 최근 변화와 전망`,
      ],
      paragraphs: [
        [
          `디지털 정보 접근성 향상으로 {keyword} 관련 콘텐츠 소비가 빠르게 증가하고 있습니다.`,
          `과학적 근거와 사용자 경험이 함께 반영된 하이브리드형 가이드 수요가 두드러집니다.`,
        ],
      ],
    },
  ];
}

export function applyKeywordTemplate(text: string, keyword: string): string {
  return text.replace(/\{keyword\}/g, kw(keyword));
}
