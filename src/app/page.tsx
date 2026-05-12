import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users, MapPin, Calendar, DollarSign, Shield, Eye, BarChart3 } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";
import { siteConfig } from "@/lib/marketing/site-config";
import { InteractivePlatformTabs } from "@/components/marketing/interactive/interactive-platform-tabs";
import { RevenueLeakageCalculator } from "@/components/marketing/interactive/revenue-leakage-calculator";
import { MigrationPathSelector } from "@/components/marketing/interactive/migration-path-selector";

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

const faqs = [
  {
    question: "Is StorageYield vandaag al een volledig PMS?",
    answer: "Nee. StorageYield is pilot-ready voor online booking, resource setup en revenue intelligence. Volledige PMS-vervanging, betalingen, toegang en portalmodules staan op de roadmap."
  },
  {
    question: "Kan ik starten zonder website rebuild?",
    answer: "Ja. Een hosted booking page kan als link, knop, iframe, QR-code of Google Business Profile-link naast je bestaande website draaien."
  },
  {
    question: "Wat is het verschil met Stora of Storeganise?",
    answer: "StorageYield is Benelux-native met lokale taal, betaalmethodes en compliance. Het combineert revenue intelligence met operationele workflows die andere tools missen."
  },
  {
    question: "Hoeveel kost StorageYield?",
    answer: "Pricing start bij €99/maand voor basis online booking. Revenue intelligence modules vanaf €299/maand. Neem contact op voor een offerte op maat."
  }
];

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Content */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">
                Benelux-native storage OS
              </p>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 lg:text-6xl">
                Verkoop, beheer en optimaliseer je opslaglocatie vanuit één platform
              </h1>
              <p className="mt-6 text-xl leading-8 text-slate-600">
                StorageYield helpt self-storage, garagebox en containeropslag operators met online reserveringen, resourcebeheer, zero-touch move-in workflows, lokale betaalvoorbereiding en revenue intelligence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800">
                  Plan demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/platform" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50">
                  Bekijk platform
                </Link>
              </div>

              {/* Module tags */}
              <div className="mt-12 flex flex-wrap gap-2">
                {[
                  "Online reserveringen",
                  "Resourcebeheer",
                  "Market Radar",
                  "Revenue intelligence",
                  "Facturatie roadmap",
                  "Access roadmap"
                ].map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Status line */}
              <p className="mt-6 text-sm text-slate-500">
                Beschikbaar voor revenue-intelligence pilots. Betalingen, ID-verificatie en access-control integraties staan op de roadmap.
              </p>
            </div>

            {/* Right: Facility Operating Layer */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-2xl">
                {/* Facility base layer - storage corridor */}
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-lg">
                  {/* Storage units grid background */}
                  <div className="grid grid-cols-8 gap-1 mb-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div key={i} className={`aspect-square rounded-sm ${i % 3 === 0 ? 'bg-emerald-100 border border-emerald-200' : 'bg-slate-200'}`} />
                    ))}
                  </div>

                  {/* Operating layer overlay */}
                  <div className="space-y-4">
                    {/* Header with occupancy */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">StorageYield Control Room</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600">79.6% bezetting</span>
                      </div>
                    </div>

                    {/* Key metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-white p-3 border border-slate-200">
                        <div className="text-xs text-slate-500">Nieuwe boekingen</div>
                        <div className="text-lg font-semibold text-slate-900">3</div>
                      </div>
                      <div className="rounded-lg bg-white p-3 border border-slate-200">
                        <div className="text-xs text-slate-500">Revenue leakage</div>
                        <div className="text-lg font-semibold text-amber-600">€2,925</div>
                      </div>
                      <div className="rounded-lg bg-white p-3 border border-slate-200">
                        <div className="text-xs text-slate-500">Onder marktprijs</div>
                        <div className="text-lg font-semibold text-red-600">2 units</div>
                      </div>
                    </div>

                    {/* Market Radar */}
                    <div className="rounded-lg bg-slate-900 p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm font-medium">Market Radar</span>
                      </div>
                      <div className="text-xs text-slate-300">Concurrent A: €2.80/m² • Jij: €2.40/m²</div>
                    </div>

                    {/* Decision memo */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-amber-600 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-amber-900">Decision Memo</div>
                          <div className="text-xs text-amber-700">Verhoog prijzen unit 12-15 met €0.20/m²</div>
                        </div>
                      </div>
                    </div>

                    {/* Booking queue */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-900">Booking Queue</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 rounded bg-blue-50 p-2 text-xs">
                          <Calendar className="h-3 w-3 text-blue-600" />
                          <span>Jan Jansen • 3m² • Morgen 14:00</span>
                        </div>
                        <div className="flex items-center gap-2 rounded bg-blue-50 p-2 text-xs">
                          <Calendar className="h-3 w-3 text-blue-600" />
                          <span>Maria Mertens • 6m² • Vrijdag</span>
                        </div>
                      </div>
                    </div>

                    {/* Status badges */}
                    <div className="flex gap-2">
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Live</span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Pilot</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">Roadmap</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-[1240px] px-5 py-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900">Geen website rebuild nodig</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900">Hosted booking page pilot</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900">Manual setup mogelijk</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900">Gebouwd voor Benelux</span>
              </div>
            </div>
          </div>
        </section>

        {/* "Van statische website naar boekbare opslaglocatie" product scene */}
        <section className="mx-auto max-w-[1400px] px-5 py-20">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Van statische website naar boekbare opslaglocatie
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Zie hoe StorageYield je bestaande website transformeert in een operationeel platform
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Before: Static website */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-red-600">1</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">Voor: Statische website</h3>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Browser frame */}
                <div className="mb-4 rounded-t-lg border border-slate-200 bg-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 h-4 flex-1 rounded bg-white"></div>
                  </div>
                </div>

                {/* Website content */}
                <div className="space-y-4">
                  <div className="h-6 rounded bg-slate-200"></div>
                  <div className="h-4 rounded bg-slate-100"></div>
                  <div className="h-4 rounded bg-slate-100 w-3/4"></div>

                  <div className="grid grid-cols-3 gap-2 mt-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded border border-slate-200 bg-slate-50"></div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border-2 border-dashed border-slate-300 p-4 text-center">
                    <p className="text-sm text-slate-500">Geen boekingsmogelijkheid</p>
                  </div>
                </div>
              </div>
            </div>

            {/* After: StorageYield integration */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-emerald-600">2</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">Na: StorageYield integratie</h3>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Browser frame */}
                <div className="mb-4 rounded-t-lg border border-slate-200 bg-slate-100 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 h-4 flex-1 rounded bg-white"></div>
                  </div>
                </div>

                {/* Website content with StorageYield */}
                <div className="space-y-4">
                  <div className="h-6 rounded bg-slate-200"></div>
                  <div className="h-4 rounded bg-slate-100"></div>
                  <div className="h-4 rounded bg-slate-100 w-3/4"></div>

                  <div className="grid grid-cols-3 gap-2 mt-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`aspect-square rounded border ${i === 2 ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}></div>
                    ))}
                  </div>

                  {/* StorageYield booking button */}
                  <div className="mt-6 rounded-lg bg-emerald-600 p-4 text-center text-white">
                    <p className="text-sm font-medium">Online reserveren</p>
                    <p className="text-xs opacity-90">Powered by StorageYield</p>
                  </div>

                  {/* Operating layer overlay */}
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900">StorageYield Active</span>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600">2 leads vandaag</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive product module tabs */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Product modules
              </h2>
              <p className="mt-4 text-xl text-slate-600">
                Ontdek hoe elke module bijdraagt aan je operationele workflow
              </p>
            </div>

            <InteractivePlatformTabs />
          </div>
        </section>

        {/* Feature status matrix */}
        <section className="mx-auto max-w-[1400px] px-5 py-20">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Feature status overzicht
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Transparante roadmap voor je planning
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg border border-slate-200 bg-white shadow-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left font-semibold text-slate-900">Module</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Live</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Pilot</th>
                  <th className="px-6 py-4 text-center font-semibold text-slate-900">Roadmap</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { module: "Online reserveringen", live: true, pilot: false, roadmap: false },
                  { module: "Resourcebeheer", live: true, pilot: false, roadmap: false },
                  { module: "Lead scoring", live: true, pilot: false, roadmap: false },
                  { module: "Market Radar", live: false, pilot: true, roadmap: false },
                  { module: "Revenue intelligence", live: false, pilot: true, roadmap: false },
                  { module: "iDEAL betalingen", live: false, pilot: false, roadmap: true },
                  { module: "Bancontact integratie", live: false, pilot: false, roadmap: true },
                  { module: "ID verificatie", live: false, pilot: false, roadmap: true },
                  { module: "Access control", live: false, pilot: false, roadmap: true },
                  { module: "Facturatie", live: false, pilot: false, roadmap: true }
                ].map((row, index) => (
                  <tr key={row.module} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                    <td className="px-6 py-4 font-medium text-slate-900">{row.module}</td>
                    <td className="px-6 py-4 text-center">
                      {row.live && <div className="mx-auto h-3 w-3 rounded-full bg-emerald-500"></div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.pilot && <div className="mx-auto h-3 w-3 rounded-full bg-amber-500"></div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.roadmap && <div className="mx-auto h-3 w-3 rounded-full bg-slate-400"></div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Benelux dark section */}
        <section className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-semibold tracking-tight">
                Benelux-native opslagsoftware
              </h2>
              <p className="mt-4 text-xl text-slate-300">
                Ontworpen voor Nederlandse en Belgische marktkenmerken
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-800 p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">Lokale talen</h3>
                <p className="text-slate-300">
                  Nederlands en Frans interface, lokale adressering en support.
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">Lokale betalingen</h3>
                <p className="text-slate-300">
                  iDEAL, Bancontact en SEPA integraties op roadmap voor naadloze transacties.
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="mb-4 text-xl font-semibold">Compliance ready</h3>
                <p className="text-slate-300">
                  PEPPOL e-facturatie en lokale regelgeving ondersteuning.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-slate-800 p-8">
                <h3 className="mb-4 text-xl font-semibold">Unmanned sites</h3>
                <p className="text-slate-300 mb-4">
                  Workflows voor onbemande locaties met hoge arbeidskosten.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Self-service toegangssystemen</li>
                  <li>• Automated contracten</li>
                  <li>• Remote monitoring</li>
                </ul>
              </div>

              <div className="rounded-xl bg-slate-800 p-8">
                <h3 className="mb-4 text-xl font-semibold">Hybride resources</h3>
                <p className="text-slate-300 mb-4">
                  Self-storage, garageboxen, containers en andere opslagtypes.
                </p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>• Mixed-use facilities</li>
                  <li>• Business customers</li>
                  <li>• Seasonal pricing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue leakage calculator preview */}
        <section className="mx-auto max-w-[1400px] px-5 py-20">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Ontdek je revenue leakage
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Bereken hoeveel omzet je misloopt door onderprijsstelling
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <RevenueLeakageCalculator />
          </div>
        </section>

        {/* Migration path selector */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Kies je migratiepad
              </h2>
              <p className="mt-4 text-xl text-slate-600">
                Van handmatig beheer naar automated operations
              </p>
            </div>

            <MigrationPathSelector />
          </div>
        </section>

        {/* Tools/guides/blog preview */}
        <section className="mx-auto max-w-[1400px] px-5 py-20">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Tools, gidsen en inzichten
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Praktische hulpmiddelen voor self-storage operators
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/tools/self-storage-revenue-leakage-calculator" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-950 group-hover:text-emerald-600">Revenue Calculator</h3>
              <p className="text-sm text-slate-600">Bereken je prijsoptimalisatie potentieel</p>
            </Link>

            <Link href="/guides/self-storage-software-kopen" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-950 group-hover:text-blue-600">Aankoop gids</h3>
              <p className="text-sm text-slate-600">Stapsgewijze keuzehulp voor software</p>
            </Link>

            <Link href="/blog" className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-950 group-hover:text-purple-600">Blog & inzichten</h3>
              <p className="text-sm text-slate-600">Praktische tips voor operators</p>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-[1000px] px-5">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Veelgestelde vragen
              </h2>
            </div>

            <FaqSection faqs={faqs} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-[1400px] px-5 py-20">
          <div className="rounded-3xl bg-slate-900 px-8 py-16 text-center text-white lg:px-16">
            <h2 className="text-4xl font-semibold tracking-tight">
              Klaar om je opslaglocatie te digitaliseren?
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Plan een demo en ontdek hoe StorageYield je helpt meer te verdienen met minder werk.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-900 hover:bg-slate-100">
                Plan demo <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/platform" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-transparent px-8 py-4 text-lg font-semibold text-white hover:bg-slate-800">
                Bekijk platform
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={siteConfig.url} description={siteConfig.description} />
    </>
  );
}
