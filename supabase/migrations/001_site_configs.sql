-- 멀티 테넌트 사이트 메타데이터 · 디자인 컨셉
-- Supabase SQL Editor 또는 CLI로 실행

create extension if not exists "pgcrypto";

create table if not exists public.site_configs (
  id uuid primary key default gen_random_uuid(),
  site_name text not null,
  subdomain text not null unique,
  theme_color jsonb not null default '{}'::jsonb,
  content_data jsonb not null default '{}'::jsonb,
  naver_verification text,
  slack_webhook text,
  created_at timestamptz not null default now()
);

create index if not exists site_configs_subdomain_idx
  on public.site_configs (subdomain);

comment on table public.site_configs is '서브도메인별 멀티 테넌트 사이트 설정';
comment on column public.site_configs.subdomain is '전체 호스트명 예: abc.eanimal.kr';
comment on column public.site_configs.theme_color is 'JSON: primary, secondary, dark, cream 등';
comment on column public.site_configs.content_data is 'JSON: tagline, description, keywords, body 등';

-- RLS: 서버(service role)만 쓰도록 기본 차단 (API Route에서 service key 사용)
alter table public.site_configs enable row level security;

create policy "service role full access"
  on public.site_configs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
