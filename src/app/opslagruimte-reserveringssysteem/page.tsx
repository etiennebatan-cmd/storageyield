import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertCircle } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Online reserveringssysteem voor opslagruimte | StorageYield",
  description: "Maak je opslagwebsite boekbaar met hosted booking pages, demand capture en lead scoring. Geen website rebuild nodig.",
  alternates: { canonical: pageUrl("/opslagruimte-reserveringssysteem") }
};

export default function BookingSystemPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Online reserveringen</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl">
                Online reserveringssysteem
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                Maak je statische opslagwebsite boekbaar zonder volledige rebuild. Vraag vastleggen, lead scoring, en revenue signalen—alles vanuit één hosted booking page.
              </p>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold text-slate-950">
                  Wat je statische website mist
                </h2>
                <div className="space-y-4">
                  {[
                    "Formulieren via email—lastig om follow-up in te organiseren",
                    "Geen prijs of beschikbaarheid zichtbaarheid—klanten bellen voor basis info",
                    "Geen lead scoring—alle vragen zijn gelijk behandeld",
                    "Geen demand capture—welke units worden eigenlijk gevraagd?",
                    "Geen revenue signalen—pricing decisions zijn blind"
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-8 space-y-6">
                <h3 className="text-lg font-semibold text-slate-950">Met StorageYield reservation page</h3>
                <div className="space-y-4">
                  {[
                    {title: "Demand capture", desc: "Zie exact welke unit types worden gevraagd"},
                    {title: "Lead scoring", desc: "Prioriteit op urgentie en waarde per aanvraag"},
                    {title: "Pricing signals", desc: "Hoge vraag naar unit type X → pricing opportunity"},
                    {title: "Follow-up workflow", desc: "Automatische email, lead status tracking"},
                    {title: "Revenue intelligence", desc: "Booking data voedt pricing decisions"}
                  ].map((item) => (
                    <div key={item.title} className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-slate-950">{item.title}</p>
                      <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to deploy */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">
            Geen website rebuild nodig
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🔗",
                title: "Link",
                description: "Voeg link naar booking page toe in je website footer of CTA-knop"
              },
              {
                icon: "📱",
                title: "QR-code",
                description: "Print QR-code op borden, flyers, Google Business Profile, mailshots"
              },
              {
                icon: "📦",
                title: "Iframe",
                description: "Embed StorageYield booking page rechtstreeks in je website"
              },
              {
                icon: "🔍",
                title: "Google Business",
                description: "Link StorageYield booking page vanuit je Google Business Profile"
              }
            ].map((method) => (
              <div key={method.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="text-lg font-semibold text-slate-950">{method.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The booking flow */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-slate-950 mb-8">
              De booking flow: Van klant naar data
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Klant bezoekt",
                  description: "Via link, QR, iframe of Google Business Profile",
                  data: "Traffic source"
                },
                {
                  step: "2",
                  title: "Kiest unit type",
                  description: "Small/Medium/Large storage, prijs en beschikbaarheid zichtbaar",
                  data: "Demand per unit type"
                },
                {
                  step: "3",
                  title: "Voert gegevens in",
                  description: "Naam, email, telefoon, bedrijf, move-in datum",
                  data: "Lead score: urgentie + waarde"
                },
                {
                  step: "4",
                  title: "Bevestiging",
                  description: "Email confirmation + jouw team ziet lead in inbox",
                  data: "Booking opportunity"
                },
                {
                  step: "5",
                  title: "Revenue data",
                  description: "Boekingsdata stuurt Decision Inbox, Market Radar, Pricing Lab",
                  data: "Pricing signals"
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="text-slate-600 mt-1">{item.description}</p>
                    <div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1">
                      <span className="text-sm font-semibold text-emerald-700">📊 {item.data}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What gets measured */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">
            Wat je kunt meten en optimaliseren
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                metric: "Demand per unit type",
                description: "Welke afmetingen krijgen 10x meer vragen?",
                action: "Verhoog prijs op populaire types"
              },
              {
                metric: "Move-in urgentie",
                description: "Hoeveel klanten willen volgende week al in?",
                action: "Dynamic pricing voor rush-demand"
              },
              {
                metric: "Business vs consumer",
                description: "Hoeveel van je vraag is bedrijfsklanten?",
                action: "Separate pricing tiers per klanttype"
              },
              {
                metric: "Traffic source",
                description: "Welk channel (QR/link/iframe) brengt beste leads?",
                action: "Focus marketing op top channel"
              },
              {
                metric: "Conversion rate",
                description: "Hoeveel booking requests worden klanten?",
                action: "Follow-up workflows optimaliseren"
              },
              {
                metric: "Seasonal patterns",
                description: "Zomerpieken vs wintervallende vraag",
                action: "Pricing voorbereiden op seizoen"
              }
            ].map((item) => (
              <div key={item.metric} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">{item.metric}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-700">💡 {item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integration examples */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-white mb-12">
              Hoe het werkt met je bestaande website
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-800 p-8">
                <p className="text-sm font-bold text-emerald-400 mb-2">Voorbeeld 1: Link in footer</p>
                <div className="bg-slate-900 rounded p-4 font-mono text-sm text-slate-300">
                  <p className="text-white">&lt;footer&gt;</p>
                  <p>&nbsp;&nbsp;&lt;a href=&quot;https://book.storageyield.com/your-slug&quot;&gt;</p>
                  <p className="text-emerald-400">&nbsp;&nbsp;&nbsp;&nbsp;Maak een reservering&lt;/a&gt;</p>
                  <p>&lt;/footer&gt;</p>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-800 p-8">
                <p className="text-sm font-bold text-emerald-400 mb-2">Voorbeeld 2: Embedded iframe</p>
                <div className="bg-slate-900 rounded p-4 font-mono text-sm text-slate-300">
                  <p className="text-white">&lt;iframe</p>
                  <p>&nbsp;&nbsp;src=&quot;https://book.storageyield.com/your-slug&quot;</p>
                  <p>&nbsp;&nbsp;width=&quot;100%&quot; height=&quot;600&quot;</p>
                  <p className="text-emerald-400">&gt;&lt;/iframe&gt;</p>
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
                question: "Moet ik mijn website vervangen?",
                answer: "Nee. De hosted booking page kan als link, QR, iframe of button naast je bestaande website draaien."
              },
              {
                question: "Kan ik aanpassingen doen aan het booking formulier?",
                answer: "Ja. Velden zoals company name, move-in date, klanttype kunnen aangepast worden. Contact ons voor customisatie."
              },
              {
                question: "Wat gebeurt er met booking data?",
                answer: "Alle bookings verschijnen in StorageYield inbox met lead score. Email confirmation gaat naar klant automatisch."
              },
              {
                question: "Hoe krijgen klanten toegang?",
                answer: "De MVP stuurt email confirmatie. PIN/QR access is op roadmap. Voor nu: handmatige setup of fallback via email."
              },
              {
                question: "Kan ik mobiele link gebruiken op Google Business?",
                answer: "Ja. De booking page is mobile-optimized en werkt prima als Google Business 'Book' link."
              }
            ]}
          />
        </section>

        {/* CTA */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1240px] px-5 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Maak je opslaglocatie vandaag nog boekbaar
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Start met booking capture. Voeg revenue intelligence stap voor stap toe.
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
            <Link href="/self-storage-prijsoptimalisatie" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Prijsoptimalisatie
            </Link>
            <Link href="/platform" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Platform
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/opslagruimte-reserveringssysteem")} description="Maak je opslagwebsite boekbaar met hosted booking pages, demand capture en lead scoring. Geen website rebuild nodig." />
    </>
  );
}
