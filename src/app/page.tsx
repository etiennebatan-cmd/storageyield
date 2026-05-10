import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";
import { siteConfig } from "@/lib/marketing/site-config";
import { InteractivePlatformTabs } from "@/components/marketing/interactive/interactive-platform-tabs";
import { RevenueLeakageCalculator } from "@/components/marketing/interactive/revenue-leakage-calculator";
import { ResourceTypeSelector } from "@/components/marketing/interactive/resource-type-selector";
import { MigrationPathSelector } from "@/components/marketing/interactive/migration-path-selector";
import { FeatureStatusSwitcher } from "@/components/marketing/interactive/feature-status-switcher";

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



export default function HomePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Announcement bar */}
        <section className="border-b border-emerald-100 bg-emerald-50">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm font-bold text-emerald-900">
            <span>Gebouwd voor Benelux-operators: online reserveringen, unmanned workflows en revenue intelligence.</span>
            <Link href="/platform" className="inline-flex items-center gap-1 text-emerald-800">
              Bekijk platform <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Hero */}
        <section className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Benelux-native storage OS</p>
            <h1 className="mt-5 text-6xl font-semibold tracking-tight text-slate-950 lg:text-7xl">
              Het operating system voor moderne opslaglocaties
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              StorageYield helpt self-storage, garagebox en containeropslag operators met online verkoop, resourcebeheer, zero-touch workflows en revenue intelligence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="mailto:hello@storageyield.com" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0">
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/platform" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0">
                Bekijk platform
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="aspect-square w-full max-w-lg rounded-3xl bg-slate-100 flex items-center justify-center">
              <p className="text-slate-500">[OS Dashboard Mockup]</p>
            </div>
          </div>
        </section>

        {/* Module tags */}
        <section className="mx-auto max-w-[1240px] px-5 py-12">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Online reserveringen",
              "Resourcebeheer",
              "Zero-touch move-in",
              "Facturatie & betalingen",
              "Toegang workflows",
              "Revenue intelligence"
            ].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Proof substitute */}
        <section className="mx-auto max-w-[1240px] px-5 py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CheckCircle2, text: "Pilot-ready workflows" },
              { icon: Users, text: "Geen website rebuild nodig" },
              { icon: TrendingUp, text: "Benelux roadmap" },
              { icon: Zap, text: "Handmatige setup mogelijk" }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <Icon className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-semibold text-slate-950">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Operating system story */}
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="mb-12 text-center">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Hoe het werkt</p>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Van statische website naar operating system
            </h2>
          </div>

          <div className="space-y-16">
            {/* Sell online */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">Verkoop online</h3>
                <p className="mt-4 text-lg text-slate-600">
                  Hosted booking pages, lead capture en follow-up automation. Geen website rebuild nodig.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Hosted booking pages naast bestaande website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Lead scoring en automated follow-up</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Google Business Profile integratie</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-500">[Booking Flow Mockup]</p>
                </div>
              </div>
            </div>

            {/* Run unmanned */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 lg:order-1 flex items-center justify-center">
                <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-500">[Workflow Timeline Mockup]</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl font-semibold text-slate-950">Run unmanned</h3>
                <p className="mt-4 text-lg text-slate-600">
                  Zero-touch move-in workflows voor high-labour-cost Benelux markets.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Operator exception queue voor edge cases</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Identity & contract automation (roadmap)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Access control workflows (roadmap)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Manage resources */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">Manage resources</h3>
                <p className="mt-4 text-lg text-slate-600">
                  Units, garageboxen, containers en andere resource types in één systeem.
                </p>
                <ResourceTypeSelector />
              </div>
              <div className="flex items-center justify-center">
                <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-500">[Resource Grid Mockup]</p>
                </div>
              </div>
            </div>

            {/* Optimize revenue */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 lg:order-1 flex items-center justify-center">
                <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center">
                  <p className="text-slate-500">[Decision Inbox Mockup]</p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h3 className="text-3xl font-semibold text-slate-950">Optimize revenue</h3>
                <p className="mt-4 text-lg text-slate-600">
                  Decision memos, market radar en systematic revenue intelligence.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Decision Inbox met revenue recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Market Radar & competitor analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                    <span className="text-slate-700">Impact Report & decision tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Platform modules */}
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Everything your operation needs
            </h2>
          </div>
          <InteractivePlatformTabs />
        </section>

        {/* Feature status */}
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Wat is vandaag beschikbaar — en wat staat op de roadmap?
            </h2>
          </div>
          <FeatureStatusSwitcher />
        </section>

        {/* Benelux differentiation */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-[1240px] px-5 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Built for Benelux, not just translated
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Dutch/French/English", desc: "Native language support" },
                { title: "iDEAL/Bancontact/SEPA", desc: "Local payment readiness" },
                { title: "PEPPOL/e-invoicing", desc: "B2B compliance roadmap" },
                { title: "High-labour unmanned", desc: "Zero-touch architecture" },
                { title: "Hybrid resources", desc: "Storage + parking + bikes" },
                { title: "EU/GDPR native", desc: "Data residency & compliance" }
              ].map(({ title, desc }) => (
                <div key={title} className="rounded-xl bg-white p-6 text-center shadow-sm">
                  <h3 className="font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue calculator */}
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Bereken je revenue opportunity
            </h2>
          </div>
          <RevenueLeakageCalculator />
        </section>

        {/* Migration */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-[1240px] px-5 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
                Start without replacing everything
              </h2>
            </div>
            <MigrationPathSelector />
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[1240px] px-5 py-16">
          <FaqSection
            faqs={[
              { question: "Is StorageYield vandaag al een volledig PMS?", answer: "Nee. StorageYield is pilot-ready voor online booking, resource setup en revenue intelligence. Volledige PMS-vervanging, betalingen, toegang en portalmodules staan op de roadmap." },
              { question: "Kan ik starten zonder website rebuild?", answer: "Ja. Een hosted booking page kan als link, knop, iframe, QR-code of Google Business Profile-link naast je bestaande website draaien." },
              { question: "Zijn iDEAL, Bancontact, PEPPOL en itsme live?", answer: "Nee. Deze onderdelen worden eerlijk als roadmap of readiness gepositioneerd. In pilots kan een handmatige of concierge fallback worden gebruikt." },
              { question: "Voor wie is dit gebouwd?", answer: "Voor onafhankelijke self-storage, garagebox, containeropslag, business storage en hybride opslagoperators in België, Nederland en Luxemburg." }
            ]}
          />
        </section>

        {/* Final CTA */}
        <section className="bg-slate-950">
          <div className="mx-auto max-w-[1240px] px-5 py-16 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Klaar om je opslaglocatie te transformeren?
            </h2>
            <p className="mt-4 text-xl text-slate-300">
              Plan een demo en ontdek hoe StorageYield werkt voor jouw operatie.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="mailto:hello@storageyield.com" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500">
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/platform" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-slate-50">
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
