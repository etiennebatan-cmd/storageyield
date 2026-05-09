import Link from "next/link";
import type { SeoPage } from "@/lib/marketing/seo-pages";
import { pageUrl } from "@/lib/marketing/seo-pages";
import { siteConfig } from "@/lib/marketing/site-config";
import { BeneluxProofSection } from "@/components/marketing/benelux-proof-section";
import { ComparisonTable } from "@/components/marketing/comparison-table";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { IntegrationsRoadmapSection } from "@/components/marketing/integrations-roadmap-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { WorkflowSection } from "@/components/marketing/workflow-section";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function faqJsonLd(page: SeoPage) {
  if (!page.faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
}

export function SeoPageTemplate({ page }: { page: SeoPage }) {
  const faqSchema = faqJsonLd(page);

  return (
    <>
      <MarketingNav />
      <main className="bg-[#f6f7f9]">
        <HeroSection
          eyebrow={page.eyebrow}
          title={page.h1}
          subtitle={page.subheadline}
          primaryCta={{ label: page.ctaLabel, href: page.ctaHref }}
          secondaryCta={page.secondaryCtaLabel && page.secondaryCtaHref ? { label: page.secondaryCtaLabel, href: page.secondaryCtaHref } : undefined}
          bullets={[page.primaryKeyword, ...page.secondaryKeywords.slice(0, 3)]}
        />

        <section className="mx-auto max-w-[1180px] px-5 py-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="max-w-4xl text-xl leading-9 text-slate-700">{page.intro}</p>
          </div>
        </section>

        <FeatureGrid eyebrow="Modules" title="Wat StorageYield toevoegt" copy="Een commerciële operating layer boven je bestaande processen: boekingen, resources, opvolging en omzetbeslissingen." features={page.modules} />

        <section className="mx-auto grid max-w-[1180px] gap-4 px-5 py-12 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{section.copy}</p>
              <ul className="mt-5 space-y-2 text-sm font-medium text-slate-700">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <BeneluxProofSection />
        <WorkflowSection title="Van aanvraag naar omzetbeslissing" steps={page.workflow ?? []} />
        {page.comparison ? <ComparisonTable {...page.comparison} /> : null}
        <IntegrationsRoadmapSection />

        <section className="mx-auto max-w-[1180px] px-5 py-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Interne links</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Gerelateerde pagina’s</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {page.related.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FaqSection faqs={page.faqs} />
        <CtaSection
          title="Maak je opslaglocatie boekbaar en omzetgerichter."
          copy="Plan een korte demo of laat je huidige website, prijzen en boekingsflow bekijken voor een Benelux pilot."
          primary={{ label: page.ctaLabel, href: page.ctaHref }}
          secondary={{ label: "Bekijk demo", href: "/demo" }}
        />
      </main>
      <MarketingFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: pageUrl(page.slug),
          description: page.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" }
        }}
      />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
    </>
  );
}
