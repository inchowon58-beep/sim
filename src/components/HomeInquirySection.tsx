import { getSiteConfig } from "@/lib/site-config";
import { INQUIRY_SECTION_ID } from "@/lib/exposure-mode";
import QuickInquiryForm from "@/components/QuickInquiryForm";

export default async function HomeInquirySection() {
  const config = await getSiteConfig();

  return (
    <section id={INQUIRY_SECTION_ID} className="py-16 lg:py-20 bg-gray-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickInquiryForm
          keyword={`${config.brandName} 메인`}
          pageSlug=""
          pageTitle={`${config.brandName} 메인`}
          brandName={config.brandName}
          exposureMode={config.exposureMode}
        />
      </div>
    </section>
  );
}
