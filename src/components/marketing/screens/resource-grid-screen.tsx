import { BatteryCharging, Bike, Box, Building2, Car, Container, Mailbox, Warehouse } from "lucide-react";

const resources = [
  ["Unit", Warehouse],
  ["Garagebox", Building2],
  ["Container", Container],
  ["Archive shelf", Box],
  ["Mailbox", Mailbox],
  ["Parking", Car],
  ["Bike storage", Bike],
  ["EV charging", BatteryCharging]
] as const;

export function ResourceGridScreen() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-600">Resource-first model</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Meer dan klassieke units</h3>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {resources.map(([label, Icon], index) => (
          <div key={label} className={`rounded-2xl border p-4 ${index < 3 ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
            <Icon className="h-6 w-6 text-emerald-700" />
            <p className="mt-3 text-sm font-semibold text-slate-950">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
