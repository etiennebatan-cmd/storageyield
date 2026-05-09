import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/self-storage-software-belgie"];

export const metadata = metadataForPage(page);

export default function SelfStorageSoftwareBelgiePage() {
  return <SeoPageTemplate page={page} />;
}
