import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/digitaal-contract-opslagruimte"];

export const metadata = metadataForPage(page);

export default function DigitaalContractOpslagruimtePage() {
  return <SeoPageTemplate page={page} />;
}
