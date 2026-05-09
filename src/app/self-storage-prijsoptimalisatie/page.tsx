import type { Metadata } from "next";
import { DecisionMemoPreview } from "@/components/marketing/decision-memo-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { LifecycleFlow } from "@/components/marketing/lifecycle-flow";
import { MarketRadarPreview } from "@/components/marketing/market-radar-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Self-storage prijsoptimalisatie | StorageYield",
  description: "Revenue intelligence voor self-storage met Decision Inbox, Market Radar, Pricing Lab en Impact Report.",
  alternates: { canonical: pageUrl("/self-storage-prijsoptimalisatie") }
};

export default function PricingIntelligencePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Revenue intelligence"
          title="Prijsoptimalisatie en revenue intelligence voor self-storage"
          subtitle="Gebruik bezetting, vraag, concurrentieprijzen en boekingsdata om betere prijs- en omzetbeslissingen te nemen."
          ctaLabel="Laat omzetkansen analyseren"
          ctaHref="mailto:hello@storageyield.com"
          visual={<DecisionMemoPreview />}
        />
        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">PMS versus intelligence</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Your PMS stores data; StorageYield interprets it</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Het product maakt niet alleen rapporten, maar concrete beslissingen: verhogen, houden, promotie starten, competitor refresh of follow-up.</p>
          </div>
          <MarketRadarPreview />
        </section>
        <ModuleShowcase
          title="Decision types"
          modules={[
            { title: "New-customer street-rate update", copy: "Prijswijzigingen standaard voor nieuwe boekingen, niet automatisch bestaande huurders.", status: "Beschikbaar" },
            { title: "Hold price", copy: "Do-not-change aanbevelingen bij zwakke bezetting of boven-markt prijs.", status: "Beschikbaar" },
            { title: "Rent-review candidates", copy: "Bestaande huurders alleen als kandidaat en contractueel te valideren.", status: "Pilot" },
            { title: "Discount leakage", copy: "Legacy kortingen worden zichtbaar als herstelkans.", status: "Beschikbaar" },
            { title: "Campaign launch", copy: "Seasonal en vacancy playbooks als omzetactie.", status: "Pilot" },
            { title: "Competitor refresh", copy: "Stale data wordt een duidelijke decision.", status: "Beschikbaar" }
          ]}
        />
        <LifecycleFlow
          title="Van signaal naar impact"
          steps={[
            { title: "Demand Matrix", copy: "Bezetting, leads en beschikbaarheid per unit type.", status: "Pilot" },
            { title: "Price Move Simulator", copy: "Scenario’s rond prijs en bezetting.", status: "Roadmap" },
            { title: "Decision Inbox", copy: "Approve, hold, review of dismiss.", status: "Beschikbaar" },
            { title: "Impact Report", copy: "Goedgekeurde beslissingen en conversies zichtbaar.", status: "Beschikbaar" }
          ]}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Belangrijke prijsdisclaimer</h2>
            <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-700">Prijswijzigingen gelden voor nieuwe boekingen tenzij bestaande huurderreviews juridisch en contractueel gevalideerd zijn. StorageYield toont kandidaten, geen automatische verhogingen.</p>
          </div>
        </section>
        <FaqSection faqs={[
          { question: "Verhoogt StorageYield automatisch prijzen?", answer: "Nee. Beslissingen worden ter goedkeuring voorgelegd." },
          { question: "Gebruikt StorageYield elke concurrent?", answer: "Nee. Market Radar gebruikt operator-geselecteerde concurrenten." },
          { question: "Zijn bestaande huurders inbegrepen?", answer: "Alleen als review-kandidaat en nooit als automatische verhoging." }
        ]} />
        <PageSpecificCta title="Laat omzetkansen analyseren." copy="We bekijken vraag, bezetting, concurrenten en pricing om je eerste revenue decisions te vinden." label="Laat omzetkansen analyseren" />
      </main>
      <MarketingFooter />
    </>
  );
}
