import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, LineChart, Radar, Warehouse } from "lucide-react";
import { BeneluxProofSection } from "@/components/marketing/benelux-proof-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { pageUrl } from "@/lib/marketing/seo-pages";
import { siteConfig } from "@/lib/marketing/site-config";

export const metadata: Metadata = {
  title: "Self-storage software voor Benelux-operators | StorageYield",
  description: "StorageYield helpt self-storage operators in België en Nederland met online reserveringen, onbemande workflows, lokale betaalflows en revenue intelligence.",
  alternates: { canonical: pageUrl("/") },
  openGraph: {
    title: "Self-storage software voor Benelux-operators | StorageYield",
    description: "Online reserveringen, onbemande workflows, lokale betaalflows en revenue intelligence voor Benelux opslagoperators.",
    url: pageUrl("/"),
    siteName: "StorageYield",
    locale: "nl_BE",
    type: "website"
  }
};

const modules = [
  { title: "Online reserveringen", copy: "Hosted booking pages, knoppen, iframes en QR-links voor operators die boekbaar willen worden zonder website rebuild.", status: "Live MVP" },
  { title: "Resource management", copy: "Units, garageboxen, containers en business storage resources in een commerciële voorraadlaag.", status: "Pilot" },
  { title: "Zero-touch move-in", copy: "Workflowontwerp voor online reservering, contract, betaling en toegang met handmatige fallback waar nodig.", status: "Roadmap" },
  { title: "Facturatie & betalingen", copy: "Voorbereid op Benelux betaalflows zoals iDEAL, Bancontact, SEPA en e-facturatie-roadmap.", status: "Voorbereid" },
  { title: "Toegangsworkflows", copy: "Hardware-agnostische toegangslogica voor PIN, QR, mobile unlock en audit trails in toekomstige integraties.", status: "Roadmap" },
  { title: "Revenue intelligence", copy: "Decision Inbox, Market Radar, Pricing Lab en Impact Report om omzetbeslissingen te onderbouwen.", status: "Live MVP" }
];

const storageModels = [
  ["Self-storage", "Online reserveringen en prijsbeslissingen per unit type.", Warehouse],
  ["Garageboxen", "Resource-first verhuur voor boxen, parking en gemengd gebruik.", Building2],
  ["Containeropslag", "Seizoensvraag, zakelijke klanten en beschikbaarheid per container.", Warehouse],
  ["Archiefopslag", "B2B-opvolging, contractduur en facturatie-readiness.", CheckCircle2],
  ["Business storage", "Lead scoring voor hogere maandwaarde en opvolging.", LineChart],
  ["Hybride locaties", "Meerdere resource types in één booking en intelligence laag.", Radar]
];

const faqs = [
  { question: "Is StorageYield een volledig PMS?", answer: "StorageYield groeit richting een Benelux-native operating system, maar de pilot focust op booking, resources en revenue decisions. Betalingen, toegang en integraties worden eerlijk als roadmap gepositioneerd." },
  { question: "Kan ik starten met een bestaande website?", answer: "Ja. De hosted booking page kan als knop, iframe, QR-code of Google Business Profile-link worden gebruikt zonder volledige website rebuild." },
  { question: "Zijn iDEAL, Bancontact en PEPPOL live?", answer: "Nee. StorageYield is voorbereid op deze Benelux-workflows in de roadmap. Voor pilots wordt duidelijk afgesproken wat live is en wat handmatig gebeurt." },
  { question: "Voor wie is StorageYield bedoeld?", answer: "Voor onafhankelijke self-storage, garagebox, containeropslag en hybride storage operators in België, Nederland en Luxemburg." }
];

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <section className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-600">Self-storage software Benelux</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Self-storage software gebouwd voor de Benelux
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              StorageYield helpt self-storage, garagebox en containeropslag operators met online reserveringen, onbemande workflows, lokale betaalflows en revenue intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0" href={siteConfig.email}>
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0" href="/demo">
                Bekijk voorbeeld
              </Link>
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
            <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Benelux booking layer</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Van statische website naar boekbare opslaglocatie</h2>
              <p className="mt-3 text-slate-300">Hosted booking page, Booking Conversion, Market Radar en Decision Inbox in één operatorflow.</p>
              <div className="mt-6 grid gap-3">
                {[
                  ["Boekbaar", "Public URL, button, iframe en QR-link."],
                  ["Opvolgbaar", "Aanvragen worden gescoord op urgentie en waarde."],
                  ["Omzetgericht", "Prijs-, campagne- en competitor beslissingen met impact."]
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm text-slate-300">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] gap-4 px-5 py-12 md:grid-cols-3">
          {[
            ["Het probleem", "Veel Benelux-locaties draaien op statische websites, manuele move-ins, lokale betaalverwachtingen en meertalige klanten."],
            ["De oplossing", "StorageYield vormt één commerciële laag voor boekingen, resources, customer lifecycle en revenue decisions."],
            ["De pilot", "Start met hosted booking, manual competitor tracking en impactrapportage zonder te doen alsof alle integraties al live zijn."]
          ].map(([title, copy]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>

        <FeatureGrid eyebrow="Core modules" title="Beheer, automatiseer en optimaliseer je opslaglocatie" copy="StorageYield combineert booking software met revenue intelligence voor onafhankelijke operators in België, Nederland en Luxemburg." features={modules} />
        <BeneluxProofSection />
        <WorkflowSection
          title="Van statische website naar boekbare opslaglocatie"
          steps={[
            { title: "Hosted booking page", copy: "Gebruik een publieke boekingspagina naast je bestaande website." },
            { title: "Resource keuze", copy: "Laat klanten kiezen per unit type, garagebox of container." },
            { title: "Booking Conversion", copy: "Volg aanvragen op met lead score en next best action." },
            { title: "Impact Report", copy: "Zie welke beslissingen, boekingen en prijswijzigingen waarde creëren." }
          ]}
        />

        <section className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Revenue intelligence ingebouwd</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Niet alleen registreren, maar weten wat je moet veranderen</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["Demand matrix", "Vraag, bezetting en beschikbaarheid per unit type."],
                ["Market Radar", "Concurrenten die je zelf kiest en handmatig verifieert."],
                ["Decision Inbox", "Prijs-, campagne- en follow-up beslissingen met bewijs."],
                ["Lead scoring", "Nieuwe aanvragen op waarde, urgentie en conversierisico."],
                ["NOI impact", "Goedgekeurde acties en boekingen zichtbaar in Impact Report."],
                ["Rent-review candidates", "Bestaande huurders alleen als review-kandidaat, niet automatisch verhoogd."]
              ].map(([title, copy]) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Opslagmodellen</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Gebouwd voor verschillende opslagmodellen</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {storageModels.map(([title, copy, Icon]) => (
              <article key={title as string} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <Icon className="h-6 w-6 text-emerald-600" />
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy as string}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Lees verder</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                ["/self-storage-software", "Self-storage software"],
                ["/onbemande-self-storage-software", "Onbemande workflows"],
                ["/opslagruimte-reserveringssysteem", "Online reserveringssysteem"],
                ["/self-storage-facturatie", "Facturatie & betalingen"],
                ["/self-storage-prijsoptimalisatie", "Prijsoptimalisatie"],
                ["/garagebox-verhuur-software", "Garagebox verhuur software"]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} />
        <CtaSection title="Klaar om je opslaglocatie boekbaar en omzetgerichter te maken?" copy="Plan een demo of bekijk de interactieve demo om te zien hoe booking, Market Radar en revenue decisions samenkomen." primary={{ label: "Plan demo", href: siteConfig.email }} secondary={{ label: "Bekijk demo", href: "/demo" }} />
      </main>
      <MarketingFooter />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: siteConfig.name, url: siteConfig.url, description: siteConfig.description }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: siteConfig.name, applicationCategory: "BusinessApplication", operatingSystem: "Web", url: siteConfig.url, description: siteConfig.description, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
    </>
  );
}
