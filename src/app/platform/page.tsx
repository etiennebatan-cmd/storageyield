import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin, Calendar, DollarSign, Shield, Eye, BarChart3, Zap, Users, TrendingUp } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "StorageYield platform voor opslagoperators",
  description: "De Facility Operating Layer: een enkel platform dat online booking, resource management, customer journey en revenue intelligence samenbrengt voor Benelux opslaglocaties.",
  alternates: { canonical: pageUrl("/platform") }
};

const platformLayers = [
  {
    name: "Booking & website",
    description: "Hosted pages, QR-codes, Google Business Profile link of iframe naast je bestaande website.",
    features: ["Hosted booking page", "Email confirmatie", "Resource selection UI", "QR-code integration", "Google Business link"],
    status: "Beschikbaar",
    icon: Calendar
  },
  {
    name: "Resource management",
    description: "Facilities, unit types, pricing per locatie en hybride resource types (storage, garagebox, container).",
    features: ["Multi-facility setup", "Unit type variants", "Hybrid resources", "Pricing tiers", "Availability calendar"],
    status: "Pilot",
    icon: MapPin
  },
  {
    name: "Customer journey",
    description: "Lead scoring, pipeline, follow-up automation en conversion tracking met impact rapportage.",
    features: ["Lead scoring", "Pipeline management", "Follow-up workflow", "Conversion tracking", "Impact reports"],
    status: "Beschikbaar",
    icon: Users
  },
  {
    name: "Revenue intelligence",
    description: "Decision Inbox met real-time signals, Market Radar met competitor monitoring, Pricing Lab voor optimalisatie.",
    features: ["Decision Inbox", "Market Radar", "Pricing Lab", "Impact Report", "Weekly briefings"],
    status: "Beschikbaar",
    icon: TrendingUp
  },
  {
    name: "Payments & billing",
    description: "iDEAL, Bancontact, SEPA met VAT logic, structured references en PEPPOL-readiness voor B2B.",
    features: ["iDEAL & Bancontact", "SEPA support", "VAT handling", "Structured references", "PEPPOL ready"],
    status: "Roadmap",
    icon: DollarSign
  },
  {
    name: "Access control",
    description: "PIN, QR-codes, mobile unlock en non-payment suspension als part van de operating workflow.",
    features: ["PIN management", "QR-based access", "Mobile unlock", "Suspension logic", "Move-out revocation"],
    status: "Roadmap",
    icon: Shield
  },
  {
    name: "Contracts & identity",
    description: "itsme integration, ID verification, e-signatures met multi-language en multi-jurisdiction support.",
    features: ["itsme integration", "ID verification", "E-signatures", "Multi-language", "Compliance logic"],
    status: "Roadmap",
    icon: Eye
  },
  {
    name: "Reporting & API",
    description: "Weekly reports, CSV exports, API ecosystem en third-party integrations op roadmap.",
    features: ["Weekly reports", "CSV exports", "API access", "Integrations", "Webhooks"],
    status: "Pilot",
    icon: BarChart3
  }
];

export default function PlatformPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero: Operating Layer concept */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Platform</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl">
                De Facility Operating Layer
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                Eén platform dat niet omheen gaat met je fysieke locatie—het begrijpt hem. Van online verkoop tot resource management, customer journeys en operationele beslissingen, allemaal gebouwd rond hoe jij je opslagruimte runt.
              </p>
            </div>
          </div>
        </section>

        {/* Layer breakdown: Visual grid */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Acht lagen, één OS
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Start where you are. Groeien naar waar je heen wilt.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {platformLayers.map((layer) => {
                const IconComponent = layer.icon;
                return (
                  <div key={layer.name} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-emerald-600" />
                          <h3 className="text-xl font-semibold text-slate-950">{layer.name}</h3>
                        </div>
                        <p className="mt-3 text-slate-600">{layer.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {layer.features.map((feature) => (
                            <span key={feature} className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          layer.status === "Beschikbaar" ? "bg-emerald-100 text-emerald-700" :
                          layer.status === "Pilot" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {layer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Available now vs Roadmap */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Available now */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">Beschikbaar vandaag</h3>
                <p className="mt-2 text-lg text-slate-600">
                  Start meteen met online booking, resource setup en operatorbeslissingen.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Online booking pages (hosted, QR, iframe, link)",
                  "Facility & resource management",
                  "Customer pipeline & lead scoring",
                  "Decision Inbox & Market Radar",
                  "Weekly reports & briefings",
                  "Email & booking confirmatie"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">In development</h3>
                <p className="mt-2 text-lg text-slate-600">
                  Eerlijk gepositioneerde features waar we aan werken.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "iDEAL, Bancontact, SEPA payments",
                  "Access control (PIN, QR, mobile unlock)",
                  "itsme & ID verification",
                  "E-signatures & contracts",
                  "PEPPOL e-invoicing",
                  "API & third-party integrations"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Zap className="h-6 w-6 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Hoe operators StorageYield gebruiken
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Kleine operator",
                  description: "Single facility, ~50 units, manual sales cycle",
                  setup: ["Hosted booking page", "Email notifications", "Simple resource setup", "Weekly briefing"]
                },
                {
                  title: "Mid-market operator",
                  description: "3-5 facilities, mix of storage & boxes, growing sales",
                  setup: ["Multi-facility portal", "Lead scoring", "Conversion tracking", "Market Radar signals"]
                },
                {
                  title: "Large operator",
                  description: "10+ facilities, hybrid resources, 1000+ customers",
                  setup: ["Full operating layer", "Decision Inbox", "Advanced pricing", "API ready"]
                }
              ].map((useCase) => (
                <div key={useCase.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-950">{useCase.title}</h3>
                  <p className="mt-2 text-slate-600">{useCase.description}</p>
                  <div className="mt-6 space-y-2">
                    {useCase.setup.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Start without replacing */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <div className="rounded-3xl bg-slate-100 p-12 text-center">
            <h2 className="text-3xl font-semibold text-slate-950">
              Start with booking. Add layers as you grow.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              StorageYield kan naast je bestaande systemen draaien. Geen rip-and-replace, geen migratierisico.
            </p>
            <div className="mt-8 space-y-3 text-left inline-block">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700">Hosted booking page werkt als iframe, link of QR-code</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700">Resources setup kan via UI of API/import</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700">Betalingen kunnen handmatig of via fallback lopen</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-slate-700">Intelligence features draaien live terwijl je uitbouwt</span>
              </div>
            </div>
          </div>
        </section>

        {/* Integration mindset */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="text-white space-y-6">
                <h2 className="text-4xl font-semibold">
                  Gebouwd voor integratie
                </h2>
                <p className="text-xl text-slate-300">
                  StorageYield is designed als een operating layer, niet als een closed silo. Denk aan het als de controlroom die signalen verzendt, niet als de motor die alles moet zijn.
                </p>
                <div className="space-y-3">
                  {[
                    "CSV imports & exports",
                    "Email & SMS ready",
                    "Webhook architecture on roadmap",
                    "API for custom flows",
                    "Third-party ready"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800 rounded-2xl p-8">
                <div className="space-y-4 font-mono text-sm text-slate-300">
                  <div>
                    <span className="text-emerald-400">→</span> Booking created
                  </div>
                  <div>
                    <span className="text-emerald-400">→</span> Lead scored
                  </div>
                  <div>
                    <span className="text-emerald-400">→</span> Email sent
                  </div>
                  <div>
                    <span className="text-emerald-400">→</span> Signal to inbox
                  </div>
                  <div>
                    <span className="text-emerald-400">→</span> Your workflow
                  </div>
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
                question: "Moet ik mijn huidige website vervangen?",
                answer: "Nee. StorageYield booking kan als iframe, link, QR-code of button op je bestaande website draaien. Het is een add-on, niet een rip-and-replace."
              },
              {
                question: "Hoe werkt de pilot-fase?",
                answer: "Pilot features zijn live en werkend, maar kunnen nog veranderingen ondergaan. We helpen je mee bij setup en gebruikersfeedback."
              },
              {
                question: "Kan ik met handmatige betalingen starten?",
                answer: "Ja. In pilots kan een concierge-fallback draaien—je handelt betalingen vervolgens af terwijl StorageYield de administratie bijhoudt."
              },
              {
                question: "Hoe zit het met beveiliging en compliance?",
                answer: "GDPR-native, data resident in EU, SSL encryption standaard. Identity verification (itsme, ID-check) zit op de roadmap."
              },
              {
                question: "Kan ik mijn data exporteren?",
                answer: "Ja. CSV exports zijn standaard beschikbaar. API-toegang en webhooks staan op de roadmap."
              }
            ]}
          />
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1240px] px-5 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Bekijk de Facility Operating Layer in actie
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Vraag een demo aan en ontdek hoe de platformlagen voor jouw operatie werken.
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
      <SoftwareJsonLd url={pageUrl("/platform")} description="De Facility Operating Layer: een enkel platform dat online booking, resource management, customer journey en revenue intelligence samenbrengt voor Benelux opslaglocaties." />
    </>
  );
}
