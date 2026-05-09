import Link from "next/link";
import { siteConfig } from "@/lib/marketing/site-config";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/platform", label: "Platform overview" },
      { href: "/self-storage-software", label: "Self-storage software" },
      { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" },
      { href: "/onbemande-self-storage-software", label: "Onbemande workflows" },
      { href: "/self-storage-prijsoptimalisatie", label: "Revenue intelligence" }
    ]
  },
  {
    title: "Oplossingen",
    links: [
      { href: "/garagebox-verhuur-software", label: "Garagebox verhuur" },
      { href: "/container-opslag-software", label: "Container opslag" },
      { href: "/self-storage-toegangscontrole", label: "Toegangsworkflows" },
      { href: "/digitaal-contract-opslagruimte", label: "Digitale contracten" }
    ]
  },
  {
    title: "Benelux",
    links: [
      { href: "/self-storage-software-nederland", label: "Nederland" },
      { href: "/self-storage-software-belgie", label: "België" },
      { href: "/self-storage-facturatie", label: "Facturatie & compliance" },
      { href: "/stora-alternatief", label: "Stora alternatief" }
    ]
  },
  {
    title: "Contact",
    links: [
      { href: siteConfig.email, label: "Plan demo" },
      { href: "/demo", label: "Bekijk demo" },
      { href: "/signup", label: "Start pilot" }
    ]
  }
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="text-lg font-bold text-slate-950">StorageYield</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            Built for Benelux storage operators. Online reserveringen, onbemande workflows en revenue intelligence voor self-storage, garageboxen en containeropslag.
          </p>
          <p className="mt-6 text-xs text-slate-500">Legal placeholder · Privacy · Terms</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-slate-950">{column.title}</h2>
              <div className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-slate-600 hover:text-slate-950">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
