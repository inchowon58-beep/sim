import { NextResponse } from "next/server";
import { listAllTenants } from "@/lib/supabase/tenant-db";
import {
  DESIGN_E_IMAGE_CDN,
  DESIGN_E_PHONE,
} from "@/lib/tenant-content-e";

export const dynamic = "force-dynamic";

function publisherSecret(): string {
  return (
    process.env.SEO_PUBLISHER_SECRET?.trim() ||
    process.env.COLLECTION_WORKER_SECRET?.trim() ||
    ""
  );
}

function authorized(req: Request): boolean {
  const secret = publisherSecret();
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;
  const header = req.headers.get("x-seo-publisher-secret") || "";
  return header === secret;
}

/** 발행기용 — 관리자(site_configs) 도메인·연락처·디자인을 SiteProfile 형태로 반환 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenants = await listAllTenants();
    const sites = tenants
      .map((t) => {
        const host = (t.subdomain || "").trim().toLowerCase().replace(/^www\./, "");
        if (!host) return null;
        const cd = (t.content_data || {}) as Record<string, unknown>;
        const design = String(cd.siteDesign || "c").toLowerCase();
        const phone =
          String(cd.phone || "").trim() ||
          (design === "e" ? DESIGN_E_PHONE : "") ||
          "";
        const imageCdn =
          String(cd.imageCdn || "").trim().replace(/\/+$/, "") ||
          (design === "e" ? DESIGN_E_IMAGE_CDN : "") ||
          "";
        const brand = (t.site_name || host).trim();
        const tagline = String(cd.tagline || "").trim() || "강아지·고양이 파양 · 무료분양";
        const proto = host.includes("localhost") ? "http" : "https";

        return {
          id: t.id,
          hostname: host,
          siteUrl: `${proto}://${host}`,
          brandName: brand,
          companyName: brand,
          phone: phone || "010-0000-0000",
          siteDesign: design,
          tagline,
          imageUrl: "",
          imageCdn,
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      ok: true,
      count: sites.length,
      sites,
      source: "site_configs",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
