import { FeatureStatusBadge } from "@/components/marketing/feature-status-badge";

type ProductMockupVariant = "platform" | "booking" | "decision" | "billing" | "access" | "market" | "resource";

const mockups: Record<ProductMockupVariant, { title: string; subtitle: string; panels: Array<{ title: string; value: string; status: "Beschikbaar" | "Pilot" | "Roadmap" }> }> = {
  platform: {
    title: "StorageYield OS",
    subtitle: "Booking, resources, lifecycle en revenue intelligence in één operatorlaag.",
    panels: [
      { title: "Booking requests", value: "18 open", status: "Beschikbaar" },
      { title: "Resource occupancy", value: "84%", status: "Pilot" },
      { title: "Revenue decisions", value: "€2.925/mo", status: "Beschikbaar" },
      { title: "Access/payment lifecycle", value: "Prepared", status: "Roadmap" }
    ]
  },
  booking: {
    title: "Hosted booking page",
    subtitle: "Publieke boekingspagina die naast een bestaande website kan draaien.",
    panels: [
      { title: "Public URL", value: "/widget/locatie", status: "Beschikbaar" },
      { title: "Website button", value: "Embed", status: "Pilot" },
      { title: "Lead score", value: "High", status: "Beschikbaar" },
      { title: "Abandoned enquiry", value: "Future", status: "Roadmap" }
    ]
  },
  decision: {
    title: "Decision Inbox",
    subtitle: "Een memo per prijs-, booking-, campaign- of competitorbeslissing.",
    panels: [
      { title: "Raise 3 m²?", value: "+€620/mo", status: "Beschikbaar" },
      { title: "Hold 20 m²?", value: "Risk low", status: "Beschikbaar" },
      { title: "Price simulator", value: "Scenario", status: "Pilot" },
      { title: "AI copilot", value: "Future", status: "Roadmap" }
    ]
  },
  billing: {
    title: "Billing workflow",
    subtitle: "Benelux betaal- en facturatielogica zonder live integraties te overclaimen.",
    panels: [
      { title: "Invoice data", value: "VAT-ready", status: "Pilot" },
      { title: "Bank transfer", value: "Manual", status: "Pilot" },
      { title: "iDEAL/Bancontact", value: "Prepared", status: "Roadmap" },
      { title: "PEPPOL", value: "Data model", status: "Roadmap" }
    ]
  },
  access: {
    title: "Access lifecycle",
    subtitle: "Van reservering naar toegang, non-payment suspension en move-out revocation.",
    panels: [
      { title: "Manual exception", value: "Queue", status: "Pilot" },
      { title: "Access log", value: "Prepared", status: "Pilot" },
      { title: "PIN/QR", value: "Future", status: "Roadmap" },
      { title: "Mobile unlock", value: "Future", status: "Roadmap" }
    ]
  },
  market: {
    title: "Market Radar",
    subtitle: "Alleen concurrenten die de operator zelf relevant vindt.",
    panels: [
      { title: "Direct competitors", value: "3 selected", status: "Beschikbaar" },
      { title: "Manual observations", value: "Fresh", status: "Beschikbaar" },
      { title: "Price movements", value: "Signal", status: "Pilot" },
      { title: "Auto checks", value: "Future", status: "Roadmap" }
    ]
  },
  resource: {
    title: "Resource workspace",
    subtitle: "Niet alleen units: garageboxen, containers, parking en hybride resources.",
    panels: [
      { title: "Units", value: "Configured", status: "Beschikbaar" },
      { title: "Garageboxes", value: "Resource", status: "Pilot" },
      { title: "Containers", value: "Seasonal", status: "Pilot" },
      { title: "Micro-offices", value: "Future", status: "Roadmap" }
    ]
  }
};

export function ProductMockup({ variant = "platform" }: { variant?: ProductMockupVariant }) {
  const mockup = mockups[variant];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
      <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">Product preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">{mockup.title}</h2>
          </div>
          <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">Live/Pilot/Roadmap</span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{mockup.subtitle}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {mockup.panels.map((panel) => (
            <div key={panel.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-slate-200">{panel.title}</p>
                <FeatureStatusBadge status={panel.status} />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{panel.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
