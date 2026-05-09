export function ComparisonTable({
  leftTitle,
  rightTitle,
  rows
}: {
  leftTitle: string;
  rightTitle: string;
  rows: Array<{ label: string; left: string; right: string }>;
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-slate-950 px-5 py-4 text-sm font-bold text-white">
          <span>Vergelijking</span>
          <span>{leftTitle}</span>
          <span>{rightTitle}</span>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[1fr_1.2fr_1.2fr] gap-4 border-t border-slate-200 px-5 py-4 text-sm">
            <strong className="text-slate-950">{row.label}</strong>
            <span className="text-slate-600">{row.left}</span>
            <span className="font-medium text-slate-950">{row.right}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
