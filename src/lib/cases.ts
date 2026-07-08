export interface ConstructionCase {
  id: string;
  title: string;
  type: string;
  imageIndex: number;
}

export const CONSTRUCTION_CASES: ConstructionCase[] = [
  { id: "1", title: "이민 준비 가정견 파양 입소", type: "강아지파양", imageIndex: 1 },
  { id: "2", title: "군입대 전 고양이 파양 입소", type: "고양이파양", imageIndex: 2 },
  { id: "3", title: "이사로 인한 강아지 무료분양", type: "강아지무료분양", imageIndex: 3 },
  { id: "4", title: "알러지 발현 고양이 파양", type: "고양이파양", imageIndex: 4 },
  { id: "5", title: "임신·출산으로 인한 파양 입소", type: "강아지파양", imageIndex: 5 },
  { id: "6", title: "노령견 장기 위탁 케어", type: "강아지파양", imageIndex: 6 },
  { id: "7", title: "다묘 가정 고양이 무료분양", type: "고양이무료분양", imageIndex: 7 },
  { id: "8", title: "유학 전 반려견 파양 매칭", type: "강아지파양", imageIndex: 8 },
  { id: "9", title: "중형견 새 가족 무료분양", type: "강아지무료분양", imageIndex: 9 },
  { id: "10", title: "거주환경 변화 고양이 파양", type: "고양이파양", imageIndex: 10 },
  { id: "11", title: "성향 맞춤 강아지 무료입양", type: "강아지무료입양", imageIndex: 11 },
  { id: "12", title: "장기 입소 후 분양 완료", type: "무료분양 완료", imageIndex: 12 },
  { id: "13", title: "다견 갈등 분리 파양", type: "강아지파양", imageIndex: 13 },
  { id: "14", title: "보호자 질병으로 인한 파양", type: "고양이파양", imageIndex: 14 },
  { id: "15", title: "새 가족 찾는 고양이 무료입양", type: "고양이무료입양", imageIndex: 15 },
  { id: "16", title: "해외 발령 전 파양 입소", type: "강아지파양", imageIndex: 16 },
  { id: "17", title: "입소 후 건강검진·케어", type: "입소·케어", imageIndex: 17 },
  { id: "18", title: "맞춤 매칭 강아지 무료분양", type: "강아지무료분양", imageIndex: 18 },
  { id: "19", title: "입양 후 사후 상담 지원", type: "사후관리", imageIndex: 19 },
  { id: "20", title: "투명 입소비 안내·입소", type: "입소·상담", imageIndex: 20 },
];

export const REVIEWS = [
  {
    name: "이*진",
    business: "강아지 파양",
    text: "이민 준비로 더 이상 함께할 수 없어 맡겼는데, 입소 비용을 항목별로 투명하게 안내해 주셔서 안심했습니다. 새 가족 매칭 소식도 정기적으로 받았어요.",
    rating: 5,
  },
  {
    name: "박*수",
    business: "고양이 무료분양",
    text: "고양이 무료분양을 희망했는데 성향에 맞는 가족을 찾아주셨습니다. 상담 응답도 빠르고 친절했습니다.",
    rating: 5,
  },
  {
    name: "최*영",
    business: "강아지 무료분양",
    text: "이사로 키울 공간이 없어 파양을 고민하다 입소했습니다. 아이 상태 사진을 자주 보내주셔서 마음이 놓였습니다.",
    rating: 5,
  },
  {
    name: "김*호",
    business: "고양이 파양",
    text: "알러지가 심해져 파양했습니다. 가정묘 파양이라는 점을 이해해 주시고 세심하게 케어해 주셨어요.",
    rating: 5,
  },
  {
    name: "정*미",
    business: "강아지 무료입양",
    text: "가정에서 키우던 강아지를 무료입양 받았습니다. 입양 전·후 상담이 꼼꼼해서 믿을 수 있었습니다.",
    rating: 5,
  },
  {
    name: "한*우",
    business: "군입대 파양",
    text: "입대 전에 맡길 곳을 찾다가 상담했습니다. 현실적인 입소 비용만 안내받고, 제대 후에도 아이 소식을 들을 수 있어 감사합니다.",
    rating: 5,
  },
  {
    name: "윤*아",
    business: "고양이 무료분양",
    text: "다묘 가정이라 분양을 맡겼는데, 3주 만에 좋은 분을 연결해 주셨습니다. 만족도 97%라는 말이 과장이 아니네요.",
    rating: 5,
  },
  {
    name: "서*현",
    business: "강아지 파양",
    text: "노령견이라 케어가 힘들어 입소했습니다. 건강검진부터 일상 케어까지 꼼꼼해서 믿고 맡길 수 있었습니다.",
    rating: 5,
  },
  {
    name: "조*민",
    business: "고양이 파양",
    text: "무료 입소를 내세우는 곳과 달리, 처음부터 비용을 솔직히 알려주셔서 신뢰가 갔습니다. 전화 응답도 15분 내였어요.",
    rating: 5,
  },
];

export const WHY_US = [
  { num: "01", title: "투명한 입소", highlight: "항목별 안내", sub: "현실적 비용" },
  { num: "02", title: "책임 매칭", highlight: "파양·분양", sub: "맞춤 상담" },
  { num: "03", title: "입소 후 공개", highlight: "생활 사진", sub: "방문 환영" },
];

export const PROCESS_STEPS = [
  { step: "01", title: "전화·상담", desc: "파양·무료분양 사유와 아이 정보를 알려주세요" },
  { step: "02", title: "방문·안내", desc: "예약 후 센터 방문, 입소 비용과 일정을 안내받습니다" },
  { step: "03", title: "입소·매칭", desc: "케어 후 적합한 가족에게 무료분양·입양을 연결합니다" },
];
