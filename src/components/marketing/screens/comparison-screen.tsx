export function ComparisonScreen() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Neutral comparison</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-2xl font-semibold text-slate-950">Global platform approach</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Broad self-storage platform category</li>
            <li>Works best when standard workflows fit</li>
            <li>May require localisation decisions per market</li>
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="text-2xl font-semibold text-slate-950">Benelux-native approach</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>Dutch/French/English and Brussels logic from the start</li>
            <li>Static-site booking layer and concierge pilot setup</li>
            <li>Local payments, PEPPOL and unmanned workflows as roadmap priorities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
