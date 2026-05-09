"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy, X, type LucideIcon } from "lucide-react";
import type { OperatorAction, OperatorBooking } from "@/lib/operator-demo";
import { evidenceToBullets } from "@/lib/actions/evidence-format";

export type Tone = "slate" | "green" | "amber" | "red" | "blue" | "dark";

export const formatEur = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Math.round(value));

export function cx(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export function toneClass(tone: Tone) {
  return {
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    dark: "border-slate-950 bg-slate-950 text-white"
  }[tone];
}

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", toneClass(tone))}>{children}</span>;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-slate-950 text-white hover:bg-slate-800",
        variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50",
        variant === "ghost" && "bg-transparent text-slate-600 shadow-none hover:bg-slate-100",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500"
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export function SlideOver({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/25 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Review panel</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          </div>
          <button className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function LoadingSkeletonCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="card p-5" key={index}>
          <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 h-8 w-20 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export function Toasts({ items }: { items: Array<{ id: string; message: string }> }) {
  return (
    <div className="fixed right-5 top-5 z-[60] space-y-2">
      {items.map((item) => (
        <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl" key={item.id}>
          <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          {item.message}
        </div>
      ))}
    </div>
  );
}

export function ageLabel(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.round(diff / 60000));
  if (minutes < 60) return minutes < 1 ? "now" : `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function leadScore(booking: OperatorBooking) {
  let score = 25;
  const moveInDays = Math.round((new Date(booking.preferred_move_in_date).getTime() - Date.now()) / 86400000);
  if (moveInDays <= 7) score += 25;
  if (booking.customer_type === "business") score += 20;
  if (booking.unit_type_name.includes("3") || booking.unit_type_name.includes("5")) score += 15;
  if (booking.unit_type_name.includes("10") || booking.unit_type_name.includes("20")) score += 10;
  if (booking.status === "requested" && Date.now() - Date.parse(booking.created_at) > 86400000) score += 10;
  return Math.min(99, Math.max(10, score));
}

export function actionQuestion(action: OperatorAction) {
  const firstEvidence = evidenceToBullets(action.evidence)[0]?.toLowerCase() ?? "";
  if (action.title.toLowerCase().startsWith("hold")) return `${action.title}?`;
  if (action.category === "pricing" && action.recommended_street_rate) return `${action.title} to ${formatEur(action.recommended_street_rate)}?`;
  if (action.category === "campaign") return `${action.title}?`;
  if (action.category === "discount_recovery") return "Remove expired discounts?";
  if (action.category === "booking_follow_up") return `${action.title} now?`;
  if (firstEvidence.includes("stale")) return "Refresh stale competitor prices?";
  return `${action.title}?`;
}

export function actionTone(action: OperatorAction): Tone {
  if (action.priority === "high") return "red";
  if (action.priority === "medium") return "amber";
  return "slate";
}

export function ImpactStat({ label, value, icon: Icon, tone = "slate" }: { label: string; value: string | number; icon: LucideIcon; tone?: Tone }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
        <span className={cx("rounded-2xl border p-2", toneClass(tone))}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
      variant="secondary"
    >
      <span className="inline-flex items-center gap-2">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
