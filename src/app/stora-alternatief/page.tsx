import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/stora-alternatief"];

export const metadata = metadataForPage(page);

export default function StoraAlternatiefPage() {
  return <SeoPageTemplate page={page} />;
}
