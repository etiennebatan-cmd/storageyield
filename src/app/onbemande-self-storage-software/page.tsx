import type { Metadata } from "next";
import Link from "next/link";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Onbemande self-storage software | StorageYield",
  description: "Ontwerp zero-touch move-in workflows voor onbemande opslaglocaties met booking, ID, contract, payment en access readiness.",
  alternates: { canonical: pageUrl("/onbemande-self-storage-software") }
};

export default function UnmannedStoragePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Zero-touch move-in"
          title="Software voor onbemande self-storage locaties"
          subtitle="Ontwerp een move-in flow waarbij klanten online reserveren, gegevens invullen, contracten afwerken en toegang krijgen zonder handmatige tussenkomst."
          ctaLabel="Bekijk zero-touch workflow"
          ctaHref="/demo"
          visual={<ProductMockup variant="access" />}
        />

        <section className="mx-auto grid max-w-[1240px] gap-4 px-5 py-14 md:grid-cols-3">
          {[
            ["Hoge loonkost", "Onbemande locaties vragen minder baliewerk en betere uitzonderingsflows."],
            ["Permanent unmanned sites", "Klanten verwachten mobiel boeken, bevestigen en opvolgen."],
            ["Customer-first mobile flow", "Elke stap moet duidelijk zijn voordat toegang of betaling volledig geautomatiseerd is."]
          ].map(([title, copy]) => (
            <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </section>

        <ProcessFlow
          title="Zero-touch workflow, eerlijk gelabeld"
          steps={[
            { title: "Booking", copy: "Online aanvraag en booking pipeline.", status: "Beschikbaar" },
            { title: "Identity", copy: "itsme/ID verification provider roadmap met manual fallback.", status: "Roadmap" },
            { title: "Contract + payment", copy: "Digitale contracten en lokale betalingen voorbereid.", status: "Roadmap" },
            { title: "Access + active customer", copy: "Access credential integraties en exception queue als roadmap/pilot.", status: "Roadmap" }
          ]}
        />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Operator exception queue</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {["ID ontbreekt", "Contract niet afgerond", "Betaling niet bevestigd", "Access fallback nodig", "Move-in buiten uren", "Manual review"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800">{item}</div>
              ))}
            </div>
          </div>
        </section>

        <ModuleShowcase
          title="Live/pilot versus roadmap"
          modules={[
            { title: "Booking request", copy: "Beschikbaar als hosted widget/page.", status: "Beschikbaar" },
            { title: "Manual onboarding support", copy: "Concierge setup voor vroege operators.", status: "Pilot" },
            { title: "itsme, e-signature, payments", copy: "Geen live claim; voorbereid als roadmap.", status: "Roadmap" },
            { title: "PIN, QR, mobile unlock", copy: "Access-control integraties op roadmap met fallback-denken.", status: "Roadmap" }
          ]}
          columns={4}
        />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Betrouwbaarheid en fallback</h2>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">Onbemande opslag werkt alleen als uitzonderingen zichtbaar zijn: PIN fallback, QR fallback, emergency override, audit log en handmatige escalatie.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["PIN fallback", "QR fallback", "Emergency override", "Audit log", "Manual exception flow"].map((item) => <span key={item} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800">{item}</span>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-8">
          <Link href="/self-storage-toegangscontrole" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Toegangscontrole</Link>
          <Link href="/digitaal-contract-opslagruimte" className="mr-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Digitale contracten</Link>
          <Link href="/self-storage-facturatie" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Facturatie</Link>
        </section>

        <PageSpecificCta title="Ontwerp je zero-touch workflow zonder valse automatiseringsclaims." copy="We brengen live, pilot en roadmap stappen expliciet in kaart voor jouw locatie." />
      </main>
      <MarketingFooter />
    </>
  );
}
