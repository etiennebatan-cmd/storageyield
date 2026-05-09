export type FeatureStatus = "Beschikbaar" | "Pilot" | "Roadmap";

const statusStyles: Record<FeatureStatus, string> = {
  Beschikbaar: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Pilot: "border-blue-200 bg-blue-50 text-blue-800",
  Roadmap: "border-amber-200 bg-amber-50 text-amber-800"
};

export function FeatureStatusBadge({ status }: { status: FeatureStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
