import type { Metadata } from "next";
import Link from "next/link";
import { BookingPagePreview } from "@/components/marketing/booking-page-preview";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeaturePageHero } from "@/components/marketing/feature-page-hero";
import { ProcessFlow } from "@/components/marketing/lifecycle-flow";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ModuleShowcase } from "@/components/marketing/module-showcase";
import { PageSpecificCta } from "@/components/marketing/page-specific-cta";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Online reserveringssysteem voor opslagruimte | StorageYield",
  description: "Maak een statische opslagwebsite boekbaar met hosted booking pages, lead scoring en booking pipeline.",
  alternates: { canonical: pageUrl("/opslagruimte-reserveringssysteem") }
};

export default function BookingSystemPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <FeaturePageHero
          eyebrow="Online reserveringen"
          title="Online reserveringssysteem voor opslagruimte"
          subtitle="Geef je statische website een boekbare reserveringsflow zonder volledige website rebuild."
          ctaLabel="Maak je opslaglocatie boekbaar"
          ctaHref="mailto:hello@storageyield.com"
          visual={<BookingPagePreview />}
        />

        <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Statische website upgrade</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Een formulier mist te veel commerciële signalen</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">StorageYield maakt beschikbaarheid, unitkeuze, prijs, move-in datum en klanttype bruikbaar voor opvolging en revenue intelligence.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Public URL", "Website button", "Iframe", "QR code", "Google Business Profile link", "Booking Conversion pipeline"].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 font-semibold text-slate-950 shadow-sm">{item}</div>
            ))}
          </div>
        </section>

        <ProcessFlow
          title="Visitor naar booking opportunity"
          copy="De booking flow legt vraag vast per resource type en maakt follow-up meetbaar."
          steps={[
            { title: "Visitor", copy: "Klant komt via website, QR of Google Business.", status: "Beschikbaar" },
            { title: "Unit/resource", copy: "Kiest formaat, prijs en beschikbaarheid.", status: "Beschikbaar" },
            { title: "Request", copy: "Naam, email, telefoon, type klant en move-in datum.", status: "Beschikbaar" },
            { title: "Lead score", copy: "Urgentie, waarde en conversierisico zichtbaar in pipeline.", status: "Beschikbaar" }
          ]}
        />

        <ModuleShowcase
          title="Wat de reserveringslaag toevoegt"
          modules={[
            { title: "Demand capture", copy: "Zie vraag per unit/resource type in plaats van alleen losse mails.", status: "Beschikbaar" },
            { title: "Lead scoring", copy: "Business klanten, snelle move-ins en high-demand resources krijgen prioriteit.", status: "Beschikbaar" },
            { title: "Abandoned enquiry tracking", copy: "Niet-afgeronde aanvragen en remarketinglogica staan op roadmap.", status: "Roadmap" },
            { title: "Revenue signalen", copy: "Boekingsdata voedt Pricing Lab, Decision Inbox en Impact Report.", status: "Pilot" }
          ]}
          columns={4}
        />

        <section className="mx-auto max-w-[1240px] px-5 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Gerelateerde workflows</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                ["/self-storage-software", "Self-storage software"],
                ["/onbemande-self-storage-software", "Onbemande move-in"],
                ["/self-storage-prijsoptimalisatie", "Revenue intelligence"]
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{label}</Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faqs={[
          { question: "Moet ik mijn website vervangen?", answer: "Nee. De hosted booking page kan naast je bestaande website draaien." },
          { question: "Kan ik QR-codes gebruiken?", answer: "Ja, de booking URL kan op borden, flyers en Google Business Profile worden gebruikt." },
          { question: "Wordt een aanvraag automatisch een klant?", answer: "Nee. De MVP legt de aanvraag vast en stuurt opvolging; betalingen, contracten en toegang zijn roadmap/pilotflows." }
        ]} />
        <PageSpecificCta title="Maak je statische opslagwebsite boekbaar." copy="Start met een hosted booking page en meet welke unit types echte vraag krijgen." label="Maak je opslaglocatie boekbaar" />
      </main>
      <MarketingFooter />
    </>
  );
}
