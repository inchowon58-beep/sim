export interface SiteSettings {
  /** Title 접미사 (예: 의정부강아지파양 | {brandName}) */
  brandName: string;
  updatedAt: string;
}

export interface UpdateSiteSettingsInput {
  brandName: string;
}
