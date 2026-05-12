import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Key } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Garagebox verhuur software | StorageYield",
  description: "Software voor garagebox-operators die opslag, parking en business-klanten beheren. Resource-first met booking, toegang en revenue intelligence.",
  alternates: { canonical: pageUrl("/garagebox-verhuur-software") }
};

export default function GarageboxPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero: Resource-first for garageboxen */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Resource-first software</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl">
                Garagebox verhuur software
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                Garageboxen zijn niet klassieke self-storage. Je hebt opslag, parking, voertuigen, tools, business-klanten en 24/7 toegangsverwachtingen. StorageYield verstaat garagebox-logica.
              </p>
            </div>
          </div>
        </section>

        {/* What makes garageboxen different */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-slate-950 mb-8">
              Garageboxen zijn niet self-storage
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 mb-3">Waarom traditionele booking systemen niet werken</h3>
                  <ul className="space-y-3">
                    {[
                      "Genormaliseerd voor unit-types: 'Small unit' is niet 'garagebox #47 met voertuigtoegangst'",
                      "Geen mixed-resource denken: je hebt opslag, parkeerplaatsen, gereedschapskluizen naast elkaar",
                      "Business customers anders dan consumers: BTW, invoice termijn, bulk access",
                      "Toegang buiten kantooruren verwacht: 24/7 beschikbaarheid is standaard, geen fallback"
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600 font-bold">×</div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 mb-3">Hoe StorageYield garagebox-operators helpt</h3>
                  <ul className="space-y-3">
                    {[
                      "Resource-first: elke garagebox is een resource met eigen prijs, beschikbaarheid en access-regels",
                      "Mixed-resource beheer: opslag, parking, tools en business-ruimtes in hetzelfde systeem",
                      "Business-klantencontinuïteit: bulk reserveringen, invoicing, gekwoteerde toegang",
                      "Revenue intelligence: bezetting, vraag en prijsdynamica per resource type"
                    ].map((item) => (
                      <li key={item} className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resource types garageboxen */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">
            Garageboxen zijn meer dan één resource-type
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Garagebox",
                description: "Opslag voor voertuigen, fietsen, gereedschap",
                example: "€150/maand per unit"
              },
              {
                name: "Parkeerplaats",
                description: "Beveiligde outdoor parking naast gebouw",
                example: "€30/maand per plek"
              },
              {
                name: "Business ruimte",
                description: "Kleine storage voor zakelijke klanten",
                example: "€200-500/maand + BTW"
              },
              {
                name: "Gereedschapskluizen",
                description: "Kleine units voor DIY-enthousiasten",
                example: "€25/maand per kluisje"
              }
            ].map((type) => (
              <div key={type.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{type.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{type.description}</p>
                <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-bold text-emerald-700">{type.example}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Garagebox workflow */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-slate-950 mb-8">
              De garagebox customer journey in StorageYield
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Online browsing",
                  description: "Klant ziet garageboxen, parkeerplaatsen, prijzen en beschikbaarheid op je website of Google Business Profile.",
                  available: true
                },
                {
                  step: "2",
                  title: "Online reservation",
                  description: "Kiest resource type, voert gegevens in, krijgt instant bevestiging per email.",
                  available: true
                },
                {
                  step: "3",
                  title: "Business setup",
                  description: "Voor zakelijke klanten: invoice terms, bulk access management, gekwoteerde parkeerplaatsen.",
                  available: true
                },
                {
                  step: "4",
                  title: "Betaling",
                  description: "iDEAL/Bancontact live voor consumenten, invoice/SEPA voor business klanten. Op roadmap.",
                  available: false
                },
                {
                  step: "5",
                  title: "Toegang",
                  description: "PIN, QR-code, of keyfob per resource. 24/7 beschikbaarheid. Roadmap met fallbacks.",
                  available: false
                },
                {
                  step: "6",
                  title: "Revenue monitoring",
                  description: "Bezetting, vraag per resource type, seizoenstrends, dynamische pricing signalen.",
                  available: true
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                        <p className="mt-2 text-slate-600">{item.description}</p>
                      </div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ml-4 ${
                        item.available ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {item.available ? "Beschikbaar" : "Roadmap"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business customer specifics */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">
            Garageboxen hebben zakelijke klanten
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-slate-950">Wat zakelijke klanten nodig hebben</h3>
              <ul className="space-y-4">
                {[
                  "Maandelijkse invoices met referenties",
                  "BTW berekening per land",
                  "Multi-unit reserveringen",
                  "Gekwoteerde toegang (meerdere medewerkers)",
                  "Bulk pricing",
                  "Contract met termijnvoorwaarden",
                  "Audit trail voor compliance"
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Voorbeeld: Business profiel in StorageYield</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="p-3 bg-white rounded border border-slate-200">
                  <p className="text-slate-600">Klant: Bouwbedrijf XYZ</p>
                  <p className="text-slate-600">Huren: 3x garagebox + 2x parkeerplaats</p>
                  <p className="text-slate-600">Maandprijs: €610 + BTW</p>
                </div>
                <div className="p-3 bg-white rounded border border-slate-200">
                  <p className="text-slate-600">Toegang: 4 medewerkers</p>
                  <p className="text-slate-600">Invoice: maandelijks op 15e</p>
                  <p className="text-slate-600">Terms: netto 14 dagen</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available vs roadmap */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-semibold text-slate-950">Beschikbaar vandaag</h3>
                  <p className="mt-2 text-lg text-slate-600">
                    Start je garagebox verhuur workflow nu.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "Resource-first setup (garageboxen, parkeerplaatsen, tools)",
                    "Online booking page",
                    "Multi-resource reserveringen",
                    "Consumer & business customer setup",
                    "Email confirmation",
                    "Revenue intelligence per resource type",
                    "Bezettingsanalyse"
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-semibold text-slate-950">In development</h3>
                  <p className="mt-2 text-lg text-slate-600">
                    Gebouwd voor garagebox realiteiten.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "iDEAL & Bancontact voor consumenten",
                    "SEPA & invoice voor zakelijke klanten",
                    "PIN & QR access per resource",
                    "Multi-user access management",
                    "Contract templates (NL/FR/EN)",
                    "Dynamische pricing per seizoen",
                    "API voor externe integraties"
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <Key className="h-6 w-6 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <FaqSection
            faqs={[
              {
                question: "Kunnen we mixed resources (garageboxen + parkeerplaatsen) beheren?",
                answer: "Ja. StorageYield is resource-first. Elke garagebox, parkeerplaats, of opslagruimte is een resource met eigen prijs, beschikbaarheid en access-regels."
              },
              {
                question: "Hoe werkt het met zakelijke klanten en facturatie?",
                answer: "Zakelijke klanten krijgen maandelijkse invoices met referenties, BTW berekening per land, en gekwoteerde multi-user toegang. Invoice workflows zijn pilot."
              },
              {
                question: "Hebben we iets nodig voor 24/7 toegang?",
                answer: "PIN & QR-code access zijn op roadmap. Voor nu kunnen we handmatige PIN-distributie ondersteunen of fallback-access tot je hardware-provider is ingebouwd."
              },
              {
                question: "Kunnen consumenten en zakelijke klanten naast elkaar draaien?",
                answer: "Ja. StorageYield handelt beide kundig af: consumenten via iDEAL/mobiel, zakelijke klanten via invoice/bulk-access."
              },
              {
                question: "Ondersteunt StorageYield garageboxen buiten Benelux?",
                answer: "Het platform is ontworpen voor Benelux (NL/FR/EN, lokale betaling, GDPR-native). Voor andere regio's: we kunnen discussiëren hoe aan te passen."
              }
            ]}
          />
        </section>

        {/* CTA */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1240px] px-5 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Maak je garageboxen online boekbaar
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Start met resource setup en online booking. Voeg zakelijke functies stap voor stap toe.
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

        {/* Related pages */}
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <div className="flex flex-wrap gap-2">
            <Link href="/self-storage-software" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Self-storage software
            </Link>
            <Link href="/opslagruimte-reserveringssysteem" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Reserveringssysteem
            </Link>
            <Link href="/self-storage-prijsoptimalisatie" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Prijsoptimalisatie
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/garagebox-verhuur-software")} description="Software voor garagebox-operators die opslag, parking en business-klanten beheren. Resource-first met booking, toegang en revenue intelligence." />
    </>
  );
}
