import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection({
  title,
  copy,
  primary,
  secondary
}: {
  title: string;
  copy: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-14">
      <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl md:p-10">
        <h2 className="max-w-3xl text-4xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">{copy}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={primary.href} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0">
            {primary.label} <ArrowRight className="h-4 w-4" />
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
