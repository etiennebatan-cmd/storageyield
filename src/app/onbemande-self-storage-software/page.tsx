import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/onbemande-self-storage-software"];

export const metadata = metadataForPage(page);

export default function OnbemandeSelfStorageSoftwarePage() {
  return <SeoPageTemplate page={page} />;
}
