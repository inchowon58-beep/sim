import { ImageResponse } from "next/og";
import { FaviconLayout } from "@/lib/og-template";
import { parseSiteDesignId } from "@/lib/site-designs";
import { getResolvedSiteConfig } from "@/utils/siteConfig";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function AppleIcon() {
  const { tenantUi } = await getResolvedSiteConfig();
  const design = parseSiteDesignId(tenantUi?.siteDesign);

  return new ImageResponse(<FaviconLayout size={180} design={design} />, {
    ...size,
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
