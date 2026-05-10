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
  title: "Self-storage software België | StorageYield",
  description: "Belgische self-storage software met NL/FR workflows, Bancontact readiness, PEPPOL roadmap en revenue intelligence.",
  alternates: { canonical: pageUrl("/self-storage-software-belgie") }
};

export default function BelgiumPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="België"
          title="Self-storage software voor Belgische operators"
          subtitle="Ontworpen voor Nederlands/Franse klantflows, Brussels bilingual logic, Bancontact-readiness, PEPPOL-roadmap en onbemande locaties."
          ctaLabel="Start Belgische pilot"
          ctaHref="mailto:hello@storageyield.com"
          visual={<ProductMockup variant="billing" />}
        />
        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 md:grid-cols-3">
          {[
            ["Vlaanderen", "Nederlandstalige booking en operatorcopy als basis."],
            ["Brussel", "Bilingual logic voor NL/FR context en zakelijke klanten."],
            ["Wallonië", "Franstalige customer flow als uitbreidingsvereiste."]
          ].map(([title, copy]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>
        <ModuleShowcase
          title="Belgische roadmap transparency"
          modules={[
            { title: "Bancontact readiness", copy: "Roadmap, geen live betaalclaim.", status: "Roadmap" },
            { title: "SEPA", copy: "Recurring workflows als roadmap.", status: "Roadmap" },
            { title: "VAT", copy: "B2B/B2C en btw-denken in setup.", status: "Pilot" },
            { title: "PEPPOL/e-invoicing", copy: "Data model readiness en roadmap.", status: "Roadmap" },
            { title: "Unmanned locations", copy: "Booking en exception flows als pilot.", status: "Pilot" },
            { title: "Revenue intelligence", copy: "Decision Inbox en Market Radar beschikbaar.", status: "Beschikbaar" }
          ]}
        />
        <ProcessFlow
          title="Belgische operatorflow"
          steps={[
            { title: "Boekbaar", copy: "Hosted booking page naast bestaande site.", status: "Beschikbaar" },
            { title: "Taal", copy: "NL/FR/EN-first positionering.", status: "Pilot" },
            { title: "Compliance", copy: "VAT en PEPPOL-readiness roadmap.", status: "Roadmap" },
            { title: "Intelligence", copy: "Concurrenten en prijsbeslissingen per locatie.", status: "Beschikbaar" }
          ]}
        />
        <PageSpecificCta title="Bespreek je Belgische opslaglocatie." copy="We brengen taal, booking, betaalreadiness en revenue decisions voor jouw locatie in kaart." />
      </main>
      <MarketingFooter />
    </>
  );
}
