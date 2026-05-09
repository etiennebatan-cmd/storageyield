import { ProductModuleCard } from "@/components/marketing/product-module-card";

export function FeatureGrid({
  eyebrow,
  title,
  copy,
  features
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  features: Array<{ title: string; copy: string; status?: string }>;
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">{eyebrow}</p> : null}
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {copy ? <p className="mt-4 text-lg leading-8 text-slate-600">{copy}</p> : null}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <ProductModuleCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
