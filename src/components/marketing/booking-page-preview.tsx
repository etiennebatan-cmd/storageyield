import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

export function BookingPagePreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Hosted booking page</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Brussels North Storage</h2>
          </div>
          <FeatureStatusBadge status="Beschikbaar" />
        </div>
        <div className="mt-5 grid gap-3">
          {[
            ["3 m² unit", "€98/mo", "3 beschikbaar"],
            ["5 m² unit", "€118/mo", "6 beschikbaar"],
            ["10 m² business unit", "€193/mo", "2 beschikbaar"]
          ].map(([name, price, availability]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="font-semibold text-slate-950">{name}</p>
                <p className="text-sm text-slate-500">{availability}</p>
              </div>
              <p className="font-bold text-slate-950">{price}</p>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white" type="button">
          Reserveer online
        </button>
      </div>
    </div>
  );
}
