import type { Metadata } from "next";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { LifecycleFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Garagebox verhuur software | StorageYield",
  description: "Garagebox software voor Benelux-operators met online reserveringen, resources, toegangsworkflow en revenue intelligence.",
  alternates: { canonical: pageUrl("/garagebox-verhuur-software") }
};

export default function GarageboxPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Resource-first verhuur"
          title="Garagebox verhuur software voor Benelux-operators"
          subtitle="Beheer garageboxen, reserveringen, klanten, betalingen en toegangsworkflows met een resource-first systeem."
          ctaLabel="Bekijk garagebox workflow"
          ctaHref="/demo"
          visual={<ProductMockup variant="resource" />}
        />
        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Building2 className="h-8 w-8 text-emerald-600" />
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Garageboxen zijn niet altijd klassieke self-storage</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Een garageboxlocatie heeft vaak mixed-use resources: opslag, parking, voertuigen, tools, kleine business klanten en toegang buiten kantooruren.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["garagebox", "parking", "storage", "mixed use", "business customer", "access workflow"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm">{item}</div>
            ))}
          </div>
        </section>
        <LifecycleFlow
          title="Garagebox customer lifecycle"
          steps={[
            { title: "Online reservation", copy: "Resource kiezen en aanvraag vastleggen.", status: "Beschikbaar" },
            { title: "Customer setup", copy: "Klanttype, contact, move-in en follow-up.", status: "Pilot" },
            { title: "Payment/access", copy: "Lokale betaling en toegangsautomatisering roadmap.", status: "Roadmap" },
            { title: "Revenue intelligence", copy: "Prijs, bezetting en demand signals per resource.", status: "Beschikbaar" }
          ]}
        />
        <ModuleShowcase
          title="Waarom StorageYield past bij garagebox verhuur"
          modules={[
            { title: "Resource-first", copy: "Niet alleen units; elke box of plek kan een resource zijn.", status: "Pilot" },
            { title: "Booking page", copy: "Maak bestaande garageboxwebsite boekbaar.", status: "Beschikbaar" },
            { title: "Local payment roadmap", copy: "iDEAL/Bancontact/SEPA als toekomstige workflow.", status: "Roadmap" },
            { title: "Access readiness", copy: "Toegangsstappen worden onderdeel van de lifecycle.", status: "Roadmap" }
          ]}
          columns={4}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <Link href="/self-storage-software" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Self-storage software</Link>
          <Link href="/opslagruimte-reserveringssysteem" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reserveringssysteem</Link>
          <Link href="/self-storage-prijsoptimalisatie" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Prijsoptimalisatie</Link>
        </section>
        <PageSpecificCta title="Bekijk garagebox workflow." copy="Start met online reserveringen en resource setup voordat je zware integraties toevoegt." />
      </main>
      <MarketingFooter />
    </>
  );
}
