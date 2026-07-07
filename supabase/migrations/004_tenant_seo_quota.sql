-- 테넌트별 일일 SEO 생성 한도·사용량
alter table public.site_configs
  add column if not exists daily_seo_limit integer,
  add column if not exists seo_quota_date text,
  add column if not exists seo_quota_count integer not null default 0;

comment on column public.site_configs.daily_seo_limit is '일일 SEO 생성 한도 (null이면 마스터 전역 설정 따름)';
comment on column public.site_configs.seo_quota_date is 'KST 기준 마지막 카운트 날짜 YYYY-MM-DD';
comment on column public.site_configs.seo_quota_count is 'seo_quota_date 당일 생성 수';
