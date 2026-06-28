export interface KeywordGroup {
  id: string;
  /** 관리용 그룹명 (예: 강아지파양그룹) */
  name: string;
  /** 쉼표 구분 키워드 — 매칭 트리거 + description 구성에 사용 */
  keywords: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKeywordGroupInput {
  name: string;
  /** 쉼표 구분 문자열 또는 배열 */
  keywords: string | string[];
}
