import type { SeoFaq } from "@/lib/marketing/seo-pages";

export function FaqSection({ faqs }: { faqs: SeoFaq[] }) {
  if (!faqs.length) return null;

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">FAQ</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Veelgestelde vragen</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">{faq.question}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
