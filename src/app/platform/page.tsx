import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { LifecycleFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { PlatformHero } from "@/components/marketing/platform-hero";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "StorageYield platform voor opslagoperators",
  description: "Eén platform voor online verkoop, resource management, customer lifecycle en revenue intelligence voor Benelux opslaglocaties.",
  alternates: { canonical: pageUrl("/platform") }
};

const layers = [
  { title: "Website & booking", copy: "Hosted booking pages, website button, iframe, QR-code en Google Business Profile link.", status: "Beschikbaar" as const },
  { title: "Facility/resources", copy: "Facilities, unit types, units, garageboxen, containers en hybride resources.", status: "Pilot" as const },
  { title: "Customer lifecycle", copy: "Lead score, pipeline, follow-up, conversion en impactrapport.", status: "Beschikbaar" as const },
  { title: "Contracts/identity", copy: "itsme, ID verificatie, e-signature en taal/jurisdictielogica als roadmap.", status: "Roadmap" as const },
  { title: "Payments/billing", copy: "iDEAL, Bancontact, SEPA, VAT, structured references en PEPPOL readiness.", status: "Roadmap" as const },
  { title: "Access", copy: "PIN, QR, mobile unlock, non-payment suspension en move-out revocation als lifecycle.", status: "Roadmap" as const },
  { title: "Intelligence", copy: "Decision Inbox, Market Radar, Pricing Lab en Impact Report.", status: "Beschikbaar" as const },
  { title: "Reporting/API", copy: "Weekly reports, exports en toekomstige API/integratie-ecosysteem.", status: "Pilot" as const }
];

export default function PlatformPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <PlatformHero
          eyebrow="Platform overview"
          title="Eén platform voor verkoop, operatie en revenue intelligence"
          subtitle="StorageYield brengt booking, resources, customer lifecycle en beslissingen samen in een Benelux-native operating layer."
          primaryHref="mailto:hello@storageyield.com"
          primaryLabel="Plan demo"
          secondaryHref="/demo"
          secondaryLabel="Bekijk demo"
        />

        <section id="resources" className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Architecture</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">De StorageYield OS-lagen</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Geen losse featurelijst, maar een operating system dat van verkoop naar toegang, billing, intelligence en rapportage kan groeien.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {layers.map((layer) => (
                <Link key={layer.title} href="#" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{layer.status}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{layer.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{layer.copy}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ModuleShowcase eyebrow="Status" title="Wat is beschikbaar, pilot of roadmap?" modules={layers} columns={4} />
        <LifecycleFlow
          title="Van websitebezoek naar operatorbeslissing"
          steps={[
            { title: "Boekbaar worden", copy: "Hosted booking page en booking pipeline.", status: "Beschikbaar" },
            { title: "Resource vastleggen", copy: "Unit/resource setup en availability logic.", status: "Pilot" },
            { title: "Lifecycle automatiseren", copy: "Contracts, payments en access readiness.", status: "Roadmap" },
            { title: "Revenue sturen", copy: "Decisions, reports en market signals.", status: "Beschikbaar" }
          ]}
        />

        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-2">
          <ProductMockup variant="resource" />
          <ProductMockup variant="market" />
        </section>

        <ComparisonTable
          leftTitle="Losse tools"
          rightTitle="StorageYield platform"
          rows={[
            { label: "Website", left: "Statische pagina of formulier", right: "Hosted booking page en conversion pipeline" },
            { label: "Resources", left: "Spreadsheets per locatie", right: "Units, garageboxen, containers en hybride resource types" },
            { label: "Revenue", left: "Rapportage achteraf", right: "Decision Inbox met bewijs en impact" },
            { label: "Benelux", left: "Achteraf vertaald", right: "NL/FR/EN, betaal- en compliance-roadmap als ontwerpkeuze" }
          ]}
        />
        <PageSpecificCta title="Bekijk hoe de platformlagen op jouw locatie passen." copy="We kunnen starten met een booking layer en concierge setup voordat zware integraties nodig zijn." />
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/platform")} description="Eén platform voor online verkoop, resource management, customer lifecycle en revenue intelligence voor Benelux opslaglocaties." />
    </>
  );
}
