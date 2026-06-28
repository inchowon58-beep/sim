export interface KeywordEntry {
  id: string;
  /** URL 경로에 사용되는 고유 슬러그 (예: 강아지, 강아지01) */
  slug: string;
  /** 원본 키워드 (중복 시에도 동일) */
  baseKeyword: string;
  /** 중복 접미사 (첫 번째는 null, 이후 01, 02 …) */
  suffix: string | null;
  title: string;
  description: string;
  /** HTML 본문 (useContentMixer=false 일 때 사용) */
  content: string;
  /** true: 렌더 시 콘텐츠 믹서 적용 (기본값 true) */
  useContentMixer?: boolean;
  /** 생성 시 고정된 hero 이미지 URL (미설정 시 슬러그 기반 랜덤) */
  mixedImageUrl?: string;
  ogImage?: string;
  /** IndexNow 등에 사용할 키워드 태그 */
  tags?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KeywordStore {
  keywords: KeywordEntry[];
}

export interface CreateKeywordInput {
  baseKeyword: string;
  title?: string;
  description?: string;
  content?: string;
  ogImage?: string;
  tags?: string[];
  /** false 로 지정 시 입력한 content 를 그대로 사용 */
  useContentMixer?: boolean;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage?: string;
  ogSiteName: string;
  keywords?: string[];
}
