import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/marketing/site-config";

export function MigrationSection() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14">
      <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-600">Migratie zonder sprong</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Start zonder je bestaande systeem meteen te vervangen</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Begin met een booking layer, CSV-import, handmatige setup en een concierge pilot. Je bestaande website en administratie kunnen live blijven terwijl StorageYield de commerciële workflow meetbaar maakt.
          </p>
          <Link href={siteConfig.email} className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
            Start pilot <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {["Booking layer first", "Manual setup mogelijk", "CSV/import-based start", "Bestaande website blijft live", "Wekelijkse revenue audit", "Geleidelijke integratie"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
