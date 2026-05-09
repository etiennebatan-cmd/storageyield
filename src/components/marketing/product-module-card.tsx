export function ProductModuleCard({ title, copy, status }: { title: string; copy: string; status?: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {status ? <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{status}</span> : null}
      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
    </article>
  );
}
