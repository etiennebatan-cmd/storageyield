import { Metadata } from "next";
import Link from "next/link";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Self-storage software voor moderne operators | StorageYield",
  description: "Benelux-native self-storage software voor reserveringen, resources, prijzen, workflows en revenue intelligence.",
  alternates: { canonical: pageUrl("/self-storage-software") }
};

const faqs = [
  { question: "Wat moet moderne self-storage software doen?", answer: "Online verkoop, resourcebeheer, klantopvolging, lokale workflow-readiness en omzetbeslissingen ondersteunen." },
  { question: "Vervangt StorageYield mijn PMS?", answer: "Niet noodzakelijk. StorageYield kan starten als commerciële booking- en revenue layer naast bestaande processen." },
  { question: "Werkt dit voor kleine operators?", answer: "Ja. De pilot is ontworpen voor onafhankelijke operators die snel boekbaar en meetbaar willen worden." }
];

export default function SelfStorageSoftwarePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Self-storage software</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Self-storage software voor moderne opslagoperators</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">Beheer reserveringen, klanten, resources, prijzen en omzetbeslissingen vanuit één Benelux-native platform.</p>
          </div>
          <ProductMockup variant="resource" />
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Wat self-storage software hoort te doen</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Niet alleen units beheren, maar verkoop, beschikbaarheid, klantopvolging, pricing en lokale Benelux-workflows samenbrengen.</p>
          </article>
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Waarom spreadsheets tekortschieten</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Statische websites en losse sheets tonen geen real-time demand, competitor context of welke beslissing deze week geld waard is.</p>
          </article>
        </section>

        <ModuleShowcase
          eyebrow="Sell · Manage · Automate · Optimise"
          title="Platform capabilities per operatorworkflow"
          modules={[
            { title: "Sell", copy: "Hosted booking page, booking pipeline, lead scoring en follow-up.", status: "Beschikbaar" },
            { title: "Manage", copy: "Facilities, unit types, units, resource status en pricing setup.", status: "Pilot" },
            { title: "Automate", copy: "Contracts, payments, identity en access workflows als roadmap.", status: "Roadmap" },
            { title: "Optimise", copy: "Market Radar, Pricing Lab, Decision Inbox en Impact Report.", status: "Beschikbaar" }
          ]}
          columns={4}
        />

        <ComparisonTable
          leftTitle="Spreadsheet / statische website"
          rightTitle="StorageYield"
          rows={[
            { label: "Online reserveren", left: "Contactformulier of telefoon", right: "Hosted booking page en pipeline" },
            { label: "Resources", left: "Handmatig overzicht", right: "Unit/resource setup met pricing context" },
            { label: "Benelux", left: "Geen lokale workflowlogica", right: "NL/FR/EN en betaal/compliance-roadmap" },
            { label: "Revenue", left: "Achteraf rapporteren", right: "Beslissingen met bewijs en impact" }
          ]}
        />

        <ProcessFlow
          title="Benelux requirements in het productontwerp"
          steps={[
            { title: "NL/FR/EN", copy: "Meertalige klantflows als uitgangspunt.", status: "Pilot" },
            { title: "iDEAL/Bancontact/SEPA", copy: "Lokale betaalflows voorbereid als roadmap.", status: "Roadmap" },
            { title: "PEPPOL-ready", copy: "E-facturatie-readiness zonder live claim.", status: "Roadmap" },
            { title: "Unmanned flow", copy: "Booking, contract, payment en access workflow als ontwerpprincipe.", status: "Pilot" }
          ]}
        />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Verdiep je in de modules</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {[
                ["/onbemande-self-storage-software", "Onbemande workflows"],
                ["/opslagruimte-reserveringssysteem", "Reserveringssysteem"],
                ["/self-storage-facturatie", "Facturatie"],
                ["/self-storage-prijsoptimalisatie", "Prijsoptimalisatie"],
                ["/stora-alternatief", "Stora alternatief"]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">{label}</Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} />
        <PageSpecificCta title="Laat je opslaglocatie analyseren." copy="We bekijken je huidige website, resources, pricing en booking flow en bepalen waar StorageYield als eerste waarde toevoegt." label="Laat je opslaglocatie analyseren" />
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/self-storage-software")} description="Benelux-native self-storage software voor reserveringen, resources, prijzen, workflows en revenue intelligence." />
    </>
  );
}
