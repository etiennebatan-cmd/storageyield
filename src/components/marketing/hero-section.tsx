import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bullets?: string[];
};

export function HeroSection({ eyebrow, title, subtitle, primaryCta, secondaryCta, bullets = [] }: HeroSectionProps) {
  return (
    <section className="mx-auto grid max-w-[1180px] gap-10 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-emerald-600">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0" href={primaryCta.href}>
            {primaryCta.label} <ArrowRight className="h-4 w-4" />
          </Link>
          {secondaryCta ? (
            <Link className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0" href={secondaryCta.href}>
              {secondaryCta.label}
            </Link>
          ) : null}
        </div>
        {bullets.length ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
        <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Product preview</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Decision Inbox</h2>
          <p className="mt-3 text-slate-300">Prijs-, booking-, campagne- en competitor beslissingen met bewijs, risico en verwachte impact.</p>
          <div className="mt-6 space-y-3">
            {[
              ["Raise Brussels 3 m² price?", "+€620/mo", "approve"],
              ["Refresh stale competitor data?", "Data health", "review"],
              ["Launch student storage playbook?", "+€540/mo", "launch"]
            ].map(([title, impact, status]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{title}</p>
                  <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-950">{status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
