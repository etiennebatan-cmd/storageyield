import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/self-storage-software-nederland"];

export const metadata = metadataForPage(page);

export default function SelfStorageSoftwareNederlandPage() {
  return <SeoPageTemplate page={page} />;
}
