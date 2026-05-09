import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/garagebox-verhuur-software"];

export const metadata = metadataForPage(page);

export default function GarageboxVerhuurSoftwarePage() {
  return <SeoPageTemplate page={page} />;
}
