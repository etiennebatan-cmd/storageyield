import type { Metadata } from "next";
import Link from "next/link";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Stora alternatief voor Benelux operators | StorageYield",
  description: "Fair comparison page voor operators die Benelux-localisatie, statische website upgrades en revenue intelligence centraal willen zetten.",
  alternates: { canonical: pageUrl("/stora-alternatief") }
};

export default function StoraAlternativePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Vergelijk</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Stora alternatief voor Benelux self-storage operators</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">StorageYield is gebouwd voor operators die Benelux-localisatie, statische website upgrades, lokale betaalflows en revenue intelligence centraal willen zetten.</p>
          </div>
          <ProductMockup variant="platform" />
        </section>
        <section className="mx-auto max-w-[1240px] px-5 py-10">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Stora is een sterke internationale self-storage software</h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-600">Deze pagina is geen claim dat Stora features mist. Ze legt uit wanneer een Benelux-native, pilotvriendelijke aanpak met lokale roadmap en revenue decision memos beter kan passen.</p>
          </div>
        </section>
        <ModuleShowcase
          title="Wanneer een Benelux-native aanpak past"
          modules={[
            { title: "Local language", copy: "Dutch/French/English-first klantflows.", status: "Pilot" },
            { title: "Static website upgrade", copy: "Hosted booking link zonder volledige rebuild.", status: "Beschikbaar" },
            { title: "Payment roadmap", copy: "iDEAL/Bancontact/SEPA expliciet in roadmap.", status: "Roadmap" },
            { title: "PEPPOL readiness", copy: "E-facturatie als Benelux-roadmap.", status: "Roadmap" },
            { title: "Hybrid resources", copy: "Garageboxen, containers, parking en business storage.", status: "Pilot" },
            { title: "Revenue decision memos", copy: "Beslissingen met bewijs en impact.", status: "Beschikbaar" }
          ]}
        />
        <ComparisonTable
          leftTitle="Stora / global platform"
          rightTitle="StorageYield / Benelux-native approach"
          rows={[
            { label: "Scope", left: "Sterk internationaal self-storage platform", right: "Benelux pilotlaag voor booking, resources en intelligence" },
            { label: "Website start", left: "Afhankelijk van implementatie", right: "Hosted booking link voor bestaande sites" },
            { label: "Lokalisatie", left: "Per markt/configuratie", right: "NL/FR/EN, iDEAL/Bancontact/SEPA en PEPPOL-roadmap expliciet" },
            { label: "Revenue", left: "Platform analytics en reporting", right: "Decision Inbox met operator approval en impact" },
            { label: "Pilot", left: "Afhankelijk van projectaanpak", right: "Concierge onboarding en handmatige setup als startpunt" }
          ]}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-10">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Disclaimer</h2>
            <p className="mt-3 max-w-4xl text-lg leading-8 text-slate-700">Deze pagina maakt geen negatieve claims over Stora en beweert niet dat Stora specifieke features mist. Ze beschrijft StorageYield’s eigen lokale positionering.</p>
          </div>
        </section>
        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <Link href="/self-storage-software" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Self-storage software</Link>
          <Link href="/platform" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Platform</Link>
          <Link href="/self-storage-software-nederland" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Nederland</Link>
          <Link href="/self-storage-software-belgie" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">België</Link>
        </section>
        <PageSpecificCta title="Vergelijk je huidige setup." copy="We bekijken of StorageYield als Benelux booking- en revenue layer past naast je huidige software." label="Vergelijk je huidige setup" />
      </main>
      <MarketingFooter />
    </>
  );
}
