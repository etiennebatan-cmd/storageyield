import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users, BarChart3 } from "lucide-react";
import { DecisionMemoPreview } from "@/components/marketing/decision-memo-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { MarketRadarPreview } from "@/components/marketing/market-radar-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Self-storage prijsoptimalisatie | StorageYield",
  description: "Benelux-native pricing intelligence voor self-storage operators: Demand Matrix, Market Radar, Decision Inbox en Impact Report.",
  alternates: { canonical: pageUrl("/self-storage-prijsoptimalisatie") }
};

export default function PricingIntelligencePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero */}
        <FeaturePageHero
          eyebrow="Revenue operating layer"
          title="Self-storage prijsoptimalisatie"
          subtitle="Niet alleen rapporten. Een operating layer die vraag, concurrentie en verkoopdata vertaalt naar concrete pricing decisions voor jouw documenten."
          ctaLabel="Laat omzetkansen analyseren"
          ctaHref="mailto:hello@storageyield.com"
          visual={<DecisionMemoPreview />}
        />

        <section className="mx-auto max-w-[1400px] px-5 py-14 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
          <div className="space-y-5">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Price intelligence, niet alleen reporting</p>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">Beslissingen boven cijfers</h2>
            <p className="text-lg leading-8 text-slate-600">
              StorageYield helpt self-storage operators om de vraag te lezen, concurrenten te monitoren en de juiste acties te kiezen. Geen losse dashboards, maar advies dat je kunt toepassen.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Demand Matrix voor unit types",
                "Market Radar met concurrentiesignalen",
                "Decision Inbox met actievoorstellen",
                "Impact Report voor resultaten"
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <MarketRadarPreview />
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Vraag over unit types",
                  description: "Welke capaciteit is het meest gewild? Welke units lopen het snelst vol?",
                  icon: TrendingUp
                },
                {
                  title: "Concurrentieprijzen",
                  description: "Welke prijsniveaus zijn realistisch in jouw markt en per locatie?",
                  icon: BarChart3
                },
                {
                  title: "Actiegerichte advisering",
                  description: "Regenereer beslissingen: keep, raise, campaign of review.",
                  icon: Users
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <Icon className="h-6 w-6 text-emerald-600" />
                    <h3 className="mt-5 text-2xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">Wat is live en wat is roadmap?</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                label: "Beschikbaar",
                items: [
                  "Decision Inbox voor prijsvoorstellen",
                  "Market Radar competitor monitoring",
                  "Impact Report met geconverteerde beslissingen",
                  "Demand Matrix per unit type"
                ],
                dotClass: "bg-emerald-500"
              },
              {
                label: "Pilot",
                items: [
                  "Discount leakage detectie",
                  "Campaign launch playbooks",
                  "Rent review kandidaten"
                ],
                dotClass: "bg-blue-500"
              },
              {
                label: "Roadmap",
                items: [
                  "Price Move Simulator",
                  "Dynamic pricing scenarios",
                  "API voor custom pricing workflows"
                ],
                dotClass: "bg-slate-500"
              }
            ].map((group) => (
              <div key={group.label} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-950">{group.label}</h3>
                <div className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${group.dotClass}`} />
                      <p className="text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <div className="rounded-[2rem] border border-slate-200 bg-amber-50 p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Belangrijk: geen automatische verhogingen zonder review</h2>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
              StorageYield toont je pricing aanbevelingen en risico&apos;s. Je beslist zelf. Bestaande huurders krijgen geen automatische verhogingen zonder juridische en contractuele validatie.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  title: "Data we gebruiken",
                  items: ["Boekingsvolume", "Unit vraag", "Concurrentieprijzen", "Bezetting"],
                  icon: CheckCircle2
                },
                {
                  title: "Wat het oplevert",
                  items: ["Meer omzet per unit", "Minder leegstand", "Beter prijsbeleid", "Vroeg signaleren"],
                  icon: TrendingUp
                },
                {
                  title: "Hoe je het inzet",
                  items: ["Review inbox", "Impact rapport", "Tarieven aanpassen", "Kampagnes activeren"],
                  icon: Users
                }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <Icon className="h-6 w-6 text-emerald-600" />
                    <h3 className="mt-5 text-2xl font-semibold text-slate-950">{card.title}</h3>
                    <ul className="mt-4 space-y-3 text-slate-700">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <FaqSection
            faqs={[
              {
                question: "Verhoogt StorageYield automatisch tarieven?",
                answer: "Nee. Het platform genereert pricing aanbevelingen. De operator beoordeelt en voert wijzigingen door."
              },
              {
                question: "Wat is het verschil tussen Market Radar en Impact Report?",
                answer: "Market Radar observeert concurrenten en vraag. Impact Report laat zien wat goedgekeurde beslissingen opleveren."
              },
              {
                question: "Kan ik beginnen met alleen pricing signalen?",
                answer: "Ja. Je kunt eerst demand en competitor signalen gebruiken om handmatig beslissingen te nemen. Later voeg je meer automation toe."
              },
              {
                question: "Hoe helpt dit mijn Benelux operatie?",
                answer: "Het systeem is gebouwd voor lokale taal, lokale betaal- en compliance-roadmaps en de realiteit van onsite resource-mix."
              }
            ]}
          />
        </section>

        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1400px] px-5 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Zet prijsdata om in concrete acties
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Vraag, concurrentie en omzetdata samenbrengen in je decision workflow.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="mailto:hello@storageyield.com" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500">
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-slate-50">
                Bekijk demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/self-storage-prijsoptimalisatie")} description="Benelux-native pricing intelligence voor self-storage operators: Demand Matrix, Market Radar, Decision Inbox en Impact Report." />
    </>
  );
}
