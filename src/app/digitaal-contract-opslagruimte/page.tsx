import type { Metadata } from "next";
import { FileSignature } from "lucide-react";
import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { LifecycleFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Digitale contracten voor opslagruimte | StorageYield",
  description: "Contract- en ID-verificatie roadmap voor opslagruimte met taal- en jurisdictielogica voor Benelux operators.",
  alternates: { canonical: pageUrl("/digitaal-contract-opslagruimte") }
};

function ContractVisual() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
        <FileSignature className="h-8 w-8 text-emerald-300" />
        <h2 className="mt-4 text-3xl font-semibold tracking-tight">Contract workflow</h2>
        <div className="mt-6 space-y-3">
          {[
            ["Taalkeuze", "NL / FR / EN"],
            ["Jurisdictie", "BE / NL / LU"],
            ["ID-verificatie", "Roadmap"],
            ["E-signature", "Roadmap"]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4">
              <span className="font-semibold">{label}</span>
              <span className="text-slate-300">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContractPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Contracten & identiteit"
          title="Digitale contracten en ID-verificatie voor opslagruimte"
          subtitle="Maak move-ins schaalbaar met taal- en jurisdictielogica voor België, Nederland en Luxemburg."
          ctaLabel="Bekijk contractworkflow"
          ctaHref="/demo"
          visual={<ContractVisual />}
        />
        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 md:grid-cols-3">
          {[
            ["Waarom contracten harder zijn in Benelux", "Meerdere talen, landen, klanttypes en bewijsstukken maken de workflow complexer dan één generiek document."],
            ["Manual fallback blijft belangrijk", "StorageYield claimt geen live itsme of e-signature. Pilotflows kunnen wel handmatige checks structureren."],
            ["Audit trail en GDPR", "De roadmap is ontworpen rond traceerbare stappen, minimale data en duidelijke operatoruitzonderingen."]
          ].map(([title, copy]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>
        <ModuleShowcase
          title="Taal- en jurisdictielogica"
          modules={[
            { title: "Dutch", copy: "Nederland en Vlaanderen als basis.", status: "Pilot" },
            { title: "French", copy: "Wallonië en Brussel als positioneringsvereiste.", status: "Pilot" },
            { title: "English", copy: "Internationale klanten en zakelijke opslag.", status: "Pilot" },
            { title: "German later", copy: "Luxemburg en uitbreidingsscenario.", status: "Roadmap" }
          ]}
          columns={4}
        />
        <LifecycleFlow
          title="Identity en contract lifecycle"
          steps={[
            { title: "Klantgegevens", copy: "Booking data en klanttype als startpunt.", status: "Beschikbaar" },
            { title: "ID-verificatie", copy: "itsme/ID provider roadmap met manual fallback.", status: "Roadmap" },
            { title: "Contract", copy: "Digitale contractgeneratie en signing als roadmap.", status: "Roadmap" },
            { title: "Audit trail", copy: "Traceerbare stappen en uitzonderingen.", status: "Pilot" }
          ]}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
            <FeatureStatusBadge status="Roadmap" />
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">itsme en e-signature zijn roadmap</h2>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">Deze pagina bouwt SEO-authority rond een belangrijk toekomstthema, maar claimt geen live integratie.</p>
          </div>
        </section>
        <FaqSection faqs={[
          { question: "Is itsme live?", answer: "Nee. itsme wordt als roadmap behandeld." },
          { question: "Kan ik handmatig verifiëren in een pilot?", answer: "Ja. Manual fallback is juist onderdeel van de pilotaanpak." },
          { question: "Ondersteunt StorageYield juridische templates?", answer: "Niet als live claim. Jurisdictielogica is een roadmapthema." }
        ]} />
        <PageSpecificCta title="Bekijk hoe contract- en ID-stappen in je move-in flow passen." copy="We brengen taal, land en fallback-stappen helder in kaart zonder live integraties te overclaimen." />
      </main>
      <MarketingFooter />
    </>
  );
}
