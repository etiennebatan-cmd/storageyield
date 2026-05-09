import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/self-storage-software"];

export const metadata = metadataForPage(page);

export default function SelfStorageSoftwarePage() {
  return <SeoPageTemplate page={page} />;
}
