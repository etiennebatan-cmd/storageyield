import { FeatureStatus, FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export type ModuleItem = {
  title: string;
  copy: string;
  status: FeatureStatus;
};

export function ModuleShowcase({
  eyebrow,
  title,
  copy,
  modules,
  columns = 3
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  modules: ModuleItem[];
  columns?: 2 | 3 | 4;
}) {
  const grid = columns === 4 ? "lg:grid-cols-4" : columns === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">{eyebrow}</p> : null}
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {copy ? <p className="mt-4 text-lg leading-8 text-slate-600">{copy}</p> : null}
      </div>
      <div className={`mt-8 grid gap-4 md:grid-cols-2 ${grid}`}>
        {modules.map((module) => (
          <article key={module.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <FeatureStatusBadge status={module.status} />
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{module.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{module.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
