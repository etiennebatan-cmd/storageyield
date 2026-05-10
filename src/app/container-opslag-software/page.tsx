import type { Metadata } from "next";
import Link from "next/link";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Container opslag software | StorageYield",
  description: "Software voor containeropslag en containerverhuur met resourcebeheer, reserveringen, zakelijke klanten en pricing intelligence.",
  alternates: { canonical: pageUrl("/container-opslag-software") }
};

export default function ContainerStoragePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">Container storage</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Software voor containeropslag en containerverhuur</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">Beheer containers als resources: beschikbaarheid, reserveringen, klanten, toegang en omzetbeslissingen.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
            <div className="grid grid-cols-5 gap-2 rounded-[1.5rem] bg-slate-950 p-5">
              {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className={`h-10 rounded-lg ${index % 6 === 0 ? "bg-amber-400" : index % 4 === 0 ? "bg-emerald-400" : "bg-slate-700"}`} />
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-600">Container yard resource view · availability · business demand</p>
          </div>
        </section>
        <ProcessFlow
          title="Container storage als hybride opslagmodel"
          steps={[
            { title: "Resource-first", copy: "Container als resource met beschikbaarheid en tarief.", status: "Pilot" },
            { title: "Booking flow", copy: "Online reservering en follow-up.", status: "Beschikbaar" },
            { title: "Business customers", copy: "Lead scoring voor hogere maandwaarde.", status: "Beschikbaar" },
            { title: "Seasonal demand", copy: "Campagnes en prijsbeslissingen per seizoen.", status: "Pilot" }
          ]}
        />
        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-2">
          <ProductMockup variant="resource" />
          <ProductMockup variant="decision" />
        </section>
        <ModuleShowcase
          title="Waar containeroperators op sturen"
          modules={[
            { title: "Beschikbaarheid", copy: "Welke containers zijn vrij, gereserveerd of bezet?", status: "Pilot" },
            { title: "Zakelijke vraag", copy: "Business leads en contractor/e-commerce use cases.", status: "Beschikbaar" },
            { title: "Seasonality", copy: "Campagnes voor winter, Q4 en overflow demand.", status: "Pilot" },
            { title: "Pricing decisions", copy: "Occupancy en vraag vertalen naar prijs- of hold-beslissingen.", status: "Beschikbaar" }
          ]}
          columns={4}
        />
        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <Link href="/self-storage-software" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Self-storage software</Link>
          <Link href="/opslagruimte-reserveringssysteem" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Reserveringssysteem</Link>
          <Link href="/self-storage-prijsoptimalisatie" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Prijsoptimalisatie</Link>
        </section>
        <PageSpecificCta title="Plan demo voor containeropslag." copy="Bekijk hoe containers als resources in booking, demand en pricing intelligence passen." label="Plan demo voor containeropslag" />
      </main>
      <MarketingFooter />
    </>
  );
}
