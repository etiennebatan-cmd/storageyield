import { FeatureStatus, FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export type LifecycleStep = {
  title: string;
  copy: string;
  status?: FeatureStatus;
};

export function LifecycleFlow({ title, copy, steps }: { title: string; copy?: string; steps: LifecycleStep[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Lifecycle</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h2>
          {copy ? <p className="mt-4 text-lg leading-8 text-slate-600">{copy}</p> : null}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">{index + 1}</span>
              {step.status ? <div className="mt-4"><FeatureStatusBadge status={step.status} /></div> : null}
              <h3 className="mt-4 text-xl font-semibold text-slate-950">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
