import { ArrowRight, CalendarDays, Mail, MousePointerClick, PhoneCall } from "lucide-react";

export function BookingFlowScreen() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Hosted booking page</p>
        <h3 className="mt-3 text-3xl font-semibold">Brussels North Storage</h3>
        <p className="mt-2 text-sm text-slate-300">Kies je opslagruimte en vraag beschikbaarheid aan.</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          ["3 m2 unit", "EUR 98/mo", "3 beschikbaar"],
          ["5 m2 unit", "EUR 118/mo", "6 beschikbaar"],
          ["10 m2 unit", "EUR 193/mo", "2 beschikbaar"]
        ].map(([type, price, availability], index) => (
          <div key={type} className={`rounded-2xl border p-4 ${index === 0 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
            <p className="font-semibold text-slate-950">{type}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{price}</p>
            <p className="mt-1 text-sm text-slate-600">{availability}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          ["Website button", MousePointerClick],
          ["QR-code", CalendarDays],
          ["Email link", Mail],
          ["Follow-up", PhoneCall]
        ].map(([label, Icon]) => (
          <div key={label as string} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
            <span>{label as string}</span>
            {typeof Icon !== "string" ? <Icon className="h-4 w-4 text-emerald-600" /> : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-700">
        Visitor <ArrowRight className="h-4 w-4" /> Resource <ArrowRight className="h-4 w-4" /> Lead score <ArrowRight className="h-4 w-4" /> Conversion
      </div>
    </div>
  );
}
