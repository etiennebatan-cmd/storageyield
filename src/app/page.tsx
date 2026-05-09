import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, CreditCard, FileSignature, KeyRound, LineChart, MousePointerClick, Radar, Warehouse } from "lucide-react";
import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";
import { FaqSection } from "@/components/marketing/faq-section";
import { JsonLd, OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { LifecycleFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MigrationSection } from "@/components/marketing/migration-section";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { ProofBand } from "@/components/marketing/proof-band";
import { pageUrl } from "@/lib/marketing/seo-pages";
import { siteConfig } from "@/lib/marketing/site-config";

export const metadata: Metadata = {
  title: "Self-storage software voor Benelux-operators | StorageYield",
  description: "StorageYield helpt opslagoperators met online reserveringen, onbemande workflows, lokale betaalvoorbereiding en revenue intelligence.",
  alternates: { canonical: pageUrl("/") },
  openGraph: {
    title: "Self-storage software voor Benelux-operators | StorageYield",
    description: "Online reserveringen, onbemande workflows, lokale betaalvoorbereiding en revenue intelligence voor Benelux opslagoperators.",
    url: pageUrl("/"),
    siteName: siteConfig.name,
    locale: "nl_BE",
    type: "website"
  }
};

const platformModules = [
  { title: "Website & online reserveringen", copy: "Hosted booking pages, website button, iframe, QR-code en Google Business Profile-link.", status: "Beschikbaar" as const },
  { title: "Resource management", copy: "Units, garageboxen, containers, parking, archive shelves en andere resource types.", status: "Pilot" as const },
  { title: "Customer lifecycle", copy: "Van aanvraag naar lead score, follow-up, reservering en conversie.", status: "Beschikbaar" as const },
  { title: "Facturatie & betalingen", copy: "Voorbereid op iDEAL, Bancontact, SEPA, kaartbetaling, btw en structured references.", status: "Roadmap" as const },
  { title: "Toegangsworkflows", copy: "PIN, QR, mobile unlock, gate/smart lock integraties en non-payment suspension als roadmap.", status: "Roadmap" as const },
  { title: "Contracten & ID-verificatie", copy: "itsme, ID-provider, e-signature en jurisdictielogica met handmatige fallback.", status: "Roadmap" as const },
  { title: "Revenue intelligence", copy: "Decision Inbox, Pricing Lab, Market Radar, Impact Report en do-not-change aanbevelingen.", status: "Beschikbaar" as const },
  { title: "API & integraties", copy: "CSV/import vandaag; PMS, accounting, access en API-ecosysteem op roadmap.", status: "Roadmap" as const }
];

const faqs = [
  { question: "Is StorageYield vandaag al een volledig PMS?", answer: "Nee. StorageYield is pilot-ready voor online booking, resource setup en revenue intelligence. Volledige PMS-vervanging, betalingen, toegang en portalmodules staan op de roadmap." },
  { question: "Kan ik starten zonder website rebuild?", answer: "Ja. Een hosted booking page kan als link, knop, iframe, QR-code of Google Business Profile-link naast je bestaande website draaien." },
  { question: "Zijn iDEAL, Bancontact, PEPPOL en itsme live?", answer: "Nee. Deze onderdelen worden eerlijk als roadmap of readiness gepositioneerd. In pilots kan een handmatige of concierge fallback worden gebruikt." },
  { question: "Voor wie is dit gebouwd?", answer: "Voor onafhankelijke self-storage, garagebox, containeropslag, business storage en hybride opslagoperators in België, Nederland en Luxemburg." }
];

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <section className="border-b border-emerald-100 bg-emerald-50">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm font-bold text-emerald-900">
            <span>Gebouwd voor Benelux storage operators: online reserveringen, unmanned workflows en revenue intelligence.</span>
            <Link href="/platform" className="inline-flex items-center gap-1 text-emerald-800">
              Bekijk platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.88fr_1.12fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Benelux-native storage OS</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Het operating system voor moderne opslaglocaties in de Benelux
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              StorageYield helpt self-storage, garagebox en containeropslag operators met boekingen, resources, klantflows, lokale betaalvoorbereiding en revenue intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={siteConfig.email} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0">
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/platform" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0">
                Bekijk platform
              </Link>
            </div>
          </div>
          <ProductMockup variant="platform" />
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Waarom nu</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Veel Benelux operators draaien nog op statische websites, spreadsheets en losse tools</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Geen online reserveringsflow", MousePointerClick],
              ["Handmatige move-ins", KeyRound],
              ["Lokale betaal- en facturatiedruk", CreditCard],
              ["Geen systematische revenue intelligence", LineChart],
              ["Geen duidelijke opvolging van leads", CheckCircle2],
              ["Geen realtime zicht op resources", Warehouse]
            ].map(([title, Icon]) => (
              <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                {typeof Icon !== "string" ? <Icon className="h-6 w-6 text-emerald-600" /> : null}
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{title as string}</h3>
              </article>
            ))}
          </div>
        </section>

        <ModuleShowcase eyebrow="Platform modules" title="Alles wat je opslaglocatie nodig heeft — in één platform" copy="De volledige visie is breed, maar elke module is eerlijk gelabeld als beschikbaar, pilot of roadmap." modules={platformModules} columns={4} />

        <LifecycleFlow
          title="How StorageYield runs a facility"
          copy="Van online verkoop naar customer lifecycle, resource activatie en continue omzetoptimalisatie."
          steps={[
            { title: "Sell online", copy: "Maak je locatie boekbaar via hosted booking page, website button, iframe, QR-code of Google Business Profile.", status: "Beschikbaar" },
            { title: "Verify & onboard", copy: "Ontwerp identity, contract en payment stappen met handmatige fallback in pilot.", status: "Roadmap" },
            { title: "Activate customer/resource", copy: "Koppel status, resource en access lifecycle aan de klantflow.", status: "Pilot" },
            { title: "Optimise revenue", copy: "Gebruik Market Radar, Pricing Lab en Decision Inbox voor wekelijkse omzetbeslissingen.", status: "Beschikbaar" }
          ]}
        />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Benelux-native</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Niet vertaald voor Benelux. Ontworpen voor Benelux.</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {["Dutch/French/English customer flows", "iDEAL/Bancontact/SEPA roadmap", "PEPPOL/e-invoicing readiness", "Unmanned facility logic", "Hybrid resources, not only units", "Local competitor intelligence", "EU/GDPR/data-residency posture", "Brussels bilingual logic"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-800">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 lg:grid-cols-3">
          {[
            ["Beschikbaar / Pilot", ["hosted booking page", "booking requests", "unit/resource setup", "manual competitor tracking", "Decision Inbox", "Pricing Lab", "Impact Report", "concierge setup"]],
            ["Benelux roadmap", ["iDEAL", "Bancontact", "SEPA", "PEPPOL/e-facturatie", "Dutch/French contract logic", "itsme/ID verification", "access-control integrations"]],
            ["Intelligence roadmap", ["Demand Matrix", "Price Move Simulator", "Unit/resource mix intelligence", "NOI/value creation", "AI operator copilot", "multi-site benchmarking"]]
          ].map(([title, items], index) => (
            <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <FeatureStatusBadge status={index === 0 ? "Pilot" : "Roadmap"} />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{title as string}</h2>
              <ul className="mt-5 space-y-2 text-sm font-medium text-slate-700">
                {(items as string[]).map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Revenue intelligence</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Een PMS registreert. StorageYield adviseert.</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Decision memos, Demand Matrix, Price Move Simulator, Market Radar, NOI impact en do-not-change aanbevelingen maken de commerciële laag tastbaar.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Decision memo", "Demand matrix", "Price move simulator", "Market Radar", "NOI impact", "Do-not-change recommendations"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-950 shadow-sm">{item}</div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Use cases</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Gebouwd voor klassieke en hybride opslagmodellen</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Self-storage", Warehouse],
              ["Garageboxen", Building2],
              ["Containeropslag", Warehouse],
              ["Archiefopslag", FileSignature],
              ["Business storage", LineChart],
              ["Hybride urban storage hubs", Radar],
              ["Caravan/boat storage", Warehouse],
              ["Parking and micro-offices", Building2]
            ].map(([label, Icon]) => (
              <article key={label as string} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                {typeof Icon !== "string" ? <Icon className="h-6 w-6 text-emerald-600" /> : null}
                <h3 className="mt-4 font-semibold text-slate-950">{label as string}</h3>
              </article>
            ))}
          </div>
        </section>

        <ProofBand items={["Pilot-ready workflows zonder fake klantlogo’s.", "Manual setup available voor vroege operators.", "No full website rebuild required.", "Roadmap transparency per module.", "Designed for local payment and compliance realities.", "Built around unmanned operations."]} />
        <MigrationSection />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Lees verder</p>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {[
                ["/platform", "Platform"],
                ["/self-storage-software", "Self-storage software"],
                ["/onbemande-self-storage-software", "Onbemande workflows"],
                ["/opslagruimte-reserveringssysteem", "Reserveringssysteem"],
                ["/self-storage-facturatie", "Facturatie"],
                ["/self-storage-prijsoptimalisatie", "Prijsoptimalisatie"],
                ["/garagebox-verhuur-software", "Garageboxen"],
                ["/container-opslag-software", "Containeropslag"]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">{label}</Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} />
        <PageSpecificCta title="Plan een Benelux storage pilot." copy="Bekijk hoe StorageYield je bestaande website boekbaar maakt en omzetbeslissingen zichtbaar maakt zonder integraties te overclaimen." />
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={siteConfig.url} description={siteConfig.description} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
    </>
  );
}
