import { SeoPageTemplate } from "@/components/marketing/seo-page-template";
import { metadataForPage, seoPages } from "@/lib/marketing/seo-pages";

const page = seoPages["/opslagruimte-reserveringssysteem"];

export const metadata = metadataForPage(page);

export default function OpslagruimteReserveringssysteemPage() {
  return <SeoPageTemplate page={page} />;
}
