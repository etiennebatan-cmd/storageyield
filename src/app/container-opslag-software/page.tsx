import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/container-opslag-software"];

export const metadata = metadataForPage(page);

export default function ContainerOpslagSoftwarePage() {
  return <SeoPageTemplate page={page} />;
}
