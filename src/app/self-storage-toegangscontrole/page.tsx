import type { Metadata } from "next";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { ProductMockup } from "@/components/marketing/product-mockup";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Self-storage toegangscontrole workflows | StorageYield",
  description: "Bereid opslaglocaties voor op digitale toegang, toegangscodes, mobiele toegang en unmanned workflows.",
  alternates: { canonical: pageUrl("/self-storage-toegangscontrole") }
};

export default function AccessPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Access workflows"
          title="Toegangsworkflows voor self-storage en opslaglocaties"
          subtitle="Bereid je locatie voor op digitale toegang, toegangscodes, mobiele toegang en unmanned workflows."
          ctaLabel="Bespreek toegangsworkflow"
          ctaHref="mailto:hello@storageyield.com"
          visual={<ProductMockup variant="access" />}
        />
        <ProcessFlow
          title="Van reservering naar move-out revocation"
          steps={[
            { title: "Reserve", copy: "Booking request of confirmed reservation.", status: "Beschikbaar" },
            { title: "Pay", copy: "Payment confirmation als roadmaptrigger.", status: "Roadmap" },
            { title: "Access enabled", copy: "PIN, QR of mobile unlock integraties later.", status: "Roadmap" },
            { title: "Suspend/revoke", copy: "Non-payment suspension en move-out revocation als workflow-readiness.", status: "Roadmap" }
          ]}
        />
        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Hardware-agnostic</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Toegang moet de workflow volgen, niet andersom</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">StorageYield positioneert toegang als workflow: betaald, actief, geschorst, verhuisd of uitzondering. Hardware-integraties blijven roadmap/pilot.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["PIN roadmap", "QR roadmap", "Mobile unlock roadmap", "European hardware integrations", "Fallback access", "Emergency override", "Audit log", "Manual exception"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 font-semibold text-slate-800 shadow-sm">{item}</div>
            ))}
          </div>
        </section>
        <ModuleShowcase
          title="Wat is MVP, wat is roadmap?"
          modules={[
            { title: "Manual/access mock provider", copy: "Workflow kan in pilot zichtbaar worden gemaakt.", status: "Pilot" },
            { title: "Access readiness checklist", copy: "Operators zien welke data en stappen ontbreken.", status: "Pilot" },
            { title: "Gate/smart lock integrations", copy: "Geen live claim; toekomstige integraties.", status: "Roadmap" },
            { title: "Access logs", copy: "Audit en logs als ontwerpvereiste.", status: "Roadmap" }
          ]}
          columns={4}
        />
        <PageSpecificCta title="Bespreek je toegangsworkflow." copy="We brengen reserve, payment, access, suspension en move-out stappen in kaart voor jouw locatie." label="Bespreek toegangsworkflow" />
      </main>
      <MarketingFooter />
    </>
  );
}
