export function ProofBand({ items }: { items: string[] }) {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-12">
      <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold leading-6 text-slate-800">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
