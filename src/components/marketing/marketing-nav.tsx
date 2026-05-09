import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/marketing/site-config";

const productLinks = [
  { href: "/self-storage-software", label: "Self-storage software" },
  { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" },
  { href: "/onbemande-self-storage-software", label: "Onbemande workflows" },
  { href: "/self-storage-prijsoptimalisatie", label: "Revenue intelligence" }
];

const solutionLinks = [
  { href: "/garagebox-verhuur-software", label: "Garagebox verhuur" },
  { href: "/container-opslag-software", label: "Container opslag" },
  { href: "/self-storage-software", label: "Business storage" },
  { href: "/opslagruimte-reserveringssysteem", label: "Statische website upgrade" }
];

const beneluxLinks = [
  { href: "/self-storage-software-nederland", label: "Nederland" },
  { href: "/self-storage-software-belgie", label: "België" },
  { href: "/self-storage-facturatie", label: "Facturatie & compliance" }
];

function Dropdown({ label, links }: { label: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div className="group relative">
      <button className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950" type="button">
        {label}
      </button>
      <div className="invisible absolute left-0 top-10 z-20 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {links.map((link) => (
          <Link key={link.href} className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950" href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
          StorageYield
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          <Dropdown label="Product" links={productLinks} />
          <Dropdown label="Oplossingen" links={solutionLinks} />
          <Dropdown label="Benelux" links={beneluxLinks} />
          <Link className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950" href="/stora-alternatief">
            Vergelijk
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950 sm:inline-flex" href={siteConfig.demoPath}>
            Bekijk demo
          </Link>
          <Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0" href={siteConfig.email}>
            Plan demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
