import type { Metadata } from "next";
import Link from "next/link";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { PaymentFlowPreview } from "@/components/marketing/payment-flow-preview";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Facturatie en betaalflows voor self-storage | StorageYield",
  description: "Benelux self-storage facturatie met iDEAL, Bancontact, SEPA en PEPPOL als duidelijke roadmap/readiness.",
  alternates: { canonical: pageUrl("/self-storage-facturatie") }
};

export default function BillingPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Finance & compliance"
          title="Facturatie en betaalflows voor Benelux self-storage"
          subtitle="Ontwerp je opslagsoftware rond lokale betaalmethodes, terugkerende facturatie, B2B/B2C-logica en PEPPOL-ready workflows."
          ctaLabel="Plan gesprek over facturatie"
          ctaHref="mailto:hello@storageyield.com"
          visual={<PaymentFlowPreview />}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Waarom US/UK payment logic niet genoeg is</h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">Benelux operators werken met iDEAL/Bancontact verwachtingen, SEPA, bankoverschrijving, btw, B2B/B2C-klanten en e-facturatievragen. StorageYield positioneert dit eerlijk als roadmap/readiness waar het nog niet live is.</p>
          </div>
        </section>
        <ModuleShowcase
          title="Payment methods roadmap"
          modules={[
            { title: "iDEAL", copy: "Ontworpen voor Nederlandse betaalflows.", status: "Roadmap" },
            { title: "Bancontact", copy: "Voorbereid op Belgische betaalvoorkeuren.", status: "Roadmap" },
            { title: "SEPA", copy: "Recurring billing en direct debit als roadmap.", status: "Roadmap" },
            { title: "Card / bank transfer", copy: "Handmatige of pilot fallback mogelijk.", status: "Pilot" }
          ]}
          columns={4}
        />
        <ProcessFlow
          title="Invoice process"
          steps={[
            { title: "Subscription", copy: "Klant/resource contractueel vastleggen.", status: "Pilot" },
            { title: "Invoice", copy: "Btw, klanttype en structured references.", status: "Roadmap" },
            { title: "Payment", copy: "Lokale methodes op roadmap met fallback.", status: "Roadmap" },
            { title: "Overdue", copy: "Payment reminders en overdue workflows.", status: "Roadmap" }
          ]}
        />
        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 md:grid-cols-3">
          {["B2B/B2C + VAT", "Structured payment references", "PEPPOL-ready data model", "Operator admin reduction", "Accounting exports roadmap", "Overdue workflows"].map((item) => (
            <article key={item} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">{item}</h2>
            </article>
          ))}
        </section>
        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <Link href="/self-storage-software-nederland" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Nederland</Link>
          <Link href="/self-storage-software-belgie" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">België</Link>
          <Link href="/digitaal-contract-opslagruimte" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Digitale contracten</Link>
        </section>
        <PageSpecificCta title="Plan gesprek over Benelux facturatie." copy="We scheiden live/pilot/roadmap duidelijk en bepalen welke administratieve workflow vandaag al waarde toevoegt." label="Plan gesprek over facturatie" />
      </main>
      <MarketingFooter />
    </>
  );
}
