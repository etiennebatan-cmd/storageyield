import type { Metadata } from "next";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Self-storage software Nederland | StorageYield",
  description: "Self-storage software voor Nederlandse operators met online reserveringen, iDEAL-readiness, SEPA roadmap en revenue intelligence.",
  alternates: { canonical: pageUrl("/self-storage-software-nederland") }
};

export default function NetherlandsPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Nederland"
          title="Self-storage software voor Nederlandse operators"
          subtitle="Maak je locatie boekbaar, volg leads op en bereid workflows voor op iDEAL, SEPA en Nederlandse operationele verwachtingen."
          ctaLabel="Start Nederlandse pilot"
          ctaHref="mailto:hello@storageyield.com"
          visual={<ProductMockup variant="booking" />}
        />
        <ModuleShowcase
          title="Nederlandse vereisten, eerlijk gelabeld"
          modules={[
            { title: "iDEAL readiness", copy: "Ontworpen voor iDEAL-workflows in de roadmap.", status: "Roadmap" },
            { title: "SEPA", copy: "Recurring billing en direct debit als roadmap.", status: "Roadmap" },
            { title: "Dutch language", copy: "Nederlandse customer flow als basis.", status: "Pilot" },
            { title: "KVK/VAT fields", copy: "Zakelijke klantdata in pilotsetup.", status: "Pilot" },
            { title: "Static website booking link", copy: "Hosted booking page naast bestaande site.", status: "Beschikbaar" },
            { title: "Competitor tracking", copy: "Operator-selected Market Radar.", status: "Beschikbaar" }
          ]}
        />
        <ProcessFlow
          title="Van Nederlandse website naar revenue decisions"
          steps={[
            { title: "Boekbaar", copy: "Booking link, iframe of Google Business link.", status: "Beschikbaar" },
            { title: "Onbemande opslag", copy: "Move-in workflow readiness.", status: "Pilot" },
            { title: "Lokale betaling", copy: "iDEAL/SEPA roadmap.", status: "Roadmap" },
            { title: "Revenue", copy: "Prijs- en competitor decisions.", status: "Beschikbaar" }
          ]}
        />
        <PageSpecificCta title="Bespreek je Nederlandse opslaglocatie." copy="We bekijken website, resources, concurrenten en lokale roadmap-fit." />
      </main>
      <MarketingFooter />
    </>
  );
}
