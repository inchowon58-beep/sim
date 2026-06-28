import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getKeywordBySlug, getAllSlugs } from "@/lib/keywords";
import { buildDynamicPageContent } from "@/lib/page-content";
import {
  buildSeoMeta,
  resolveCanonicalBase,
  seoMetaToNextMetadata,
} from "@/lib/seo";
import { SeoSubpageLayout } from "@/components/SeoSubpageLayout";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function resolveRequestContext() {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  return resolveCanonicalBase(host, protocol);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getKeywordBySlug(slug);

  if (!entry) {
    return { title: "페이지를 찾을 수 없습니다" };
  }

  const canonicalBase = await resolveRequestContext();
  const { heroImageUrl } = await buildDynamicPageContent(entry);
  const seoMeta = buildSeoMeta(entry, canonicalBase, heroImageUrl);

  return seoMetaToNextMetadata(seoMeta);
}

export default async function KeywordPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getKeywordBySlug(slug);

  if (!entry) {
    notFound();
  }

  const canonicalBase = await resolveRequestContext();
  const pageContent = await buildDynamicPageContent(entry);
  const seoMeta = buildSeoMeta(
    entry,
    canonicalBase,
    pageContent.heroImageUrl
  );

  return (
    <SeoSubpageLayout
      entry={entry}
      seo={seoMeta}
      contentHtml={pageContent.html}
      heroImageUrl={pageContent.heroImageUrl}
    />
  );
}
