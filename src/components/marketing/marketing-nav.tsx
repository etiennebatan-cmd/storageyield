"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  {
    label: "Product",
    items: [
      { href: "/platform", label: "Platform overview" },
      { href: "/self-storage-software", label: "Self-storage" },
      { href: "/opslagruimte-reserveringssysteem", label: "Online reserveringen" },
      { href: "/onbemande-self-storage-software", label: "Onbemande workflows" },
      { href: "/self-storage-facturatie", label: "Facturatie & betalingen" },
      { href: "/self-storage-prijsoptimalisatie", label: "Revenue intelligence" }
    ]
  },
  {
    label: "Oplossingen",
    items: [
      { href: "/self-storage-software", label: "Self-storage" },
      { href: "/garagebox-verhuur-software", label: "Garagebox verhuur" },
      { href: "/container-opslag-software", label: "Containeropslag" },
      { href: "/digitaal-contract-opslagruimte", label: "Contracten & facturen" }
    ]
  },
  {
    label: "Benelux",
    items: [
      { href: "/self-storage-software-nederland", label: "Nederland" },
      { href: "/self-storage-software-belgie", label: "België" },
      { href: "/onbemande-self-storage-software", label: "Onbemande locaties" }
    ]
  },
  {
    label: "Vergelijk",
    items: [
      { href: "/stora-alternatief", label: "Stora alternatief" }
    ]
  },
  {
    label: "Contact",
    items: [
      { href: "/demo", label: "Bekijk demo" },
      { href: "/signup", label: "Start pilot" }
    ]
  }
];

export function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-950">
            StorageYield
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navItems.map((group) => (
              <div key={group.label} className="group relative">
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-950">
                  {group.label}
                  <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-2 hidden w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg group-hover:block">
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className="block text-sm text-slate-600 hover:text-slate-950">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/demo" className="hidden text-sm font-semibold text-slate-700 hover:text-slate-950 lg:block">
              Bekijk demo
            </Link>
            <Link href="/signup" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 lg:block">
              Start pilot
            </Link>
            <Link href="mailto:hello@storageyield.com" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Plan demo
            </Link>
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 lg:hidden">
            <div className="space-y-4 py-4">
              {navItems.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-semibold text-slate-950">{group.label}</p>
                  <div className="mt-2 space-y-2">
                    {group.items.map((item) => (
                      <Link key={item.href} href={item.href} className="block text-sm text-slate-600 hover:text-slate-950">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
