import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function FeaturePageHero({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  visual
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  visual: ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">{subtitle}</p>
        <Link href={ctaHref} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0">
          {ctaLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {visual}
    </section>
  );
}
