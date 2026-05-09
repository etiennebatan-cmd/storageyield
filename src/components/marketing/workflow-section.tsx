export function WorkflowSection({ title, steps }: { title: string; steps: Array<{ title: string; copy: string }> }) {
  if (!steps.length) return null;

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Workflow</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{title}</h2>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">{index + 1}</span>
            <h3 className="mt-5 text-lg font-semibold text-slate-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
