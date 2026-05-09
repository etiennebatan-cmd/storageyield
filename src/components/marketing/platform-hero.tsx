import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductMockup } from "@/components/marketing/product-mockup";

export function PlatformHero({
  eyebrow,
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">{subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0">
            {primaryLabel} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={secondaryHref} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0">
            {secondaryLabel}
          </Link>
        </div>
      </div>
      <ProductMockup variant="platform" />
    </section>
  );
}
