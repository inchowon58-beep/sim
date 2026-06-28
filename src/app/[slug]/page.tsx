import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getKeywordBySlug, getAllSlugs } from "@/lib/keywords";
import {
  buildSeoMeta,
  resolveCanonicalBase,
  seoMetaToNextMetadata,
} from "@/lib/seo";
import { AgapetStoryFrame } from "@/components/AgapetStoryFrame";

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
  const seoMeta = buildSeoMeta(entry, canonicalBase, entry.ogImage);

  return seoMetaToNextMetadata(seoMeta);
}

/**
 * 서브페이지 — head: 키워드 SEO / body: 아가펫스토리 전체
 */
export default async function KeywordPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getKeywordBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <div className="subpage-shell">
      <h1 className="sr-only">{entry.title}</h1>
      <p className="sr-only">{entry.description}</p>
      <AgapetStoryFrame title={entry.title} />
    </div>
  );
}
