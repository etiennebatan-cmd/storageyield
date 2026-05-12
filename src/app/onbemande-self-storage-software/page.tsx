import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, Lock, Shield } from "lucide-react";
import { FaqSection } from "@/components/marketing/faq-section";
import { OrganizationJsonLd, SoftwareJsonLd } from "@/components/marketing/json-ld";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { pageUrl } from "@/lib/marketing/seo-pages";

export const metadata: Metadata = {
  title: "Onbemande self-storage software | StorageYield",
  description: "Zero-touch move-in workflows voor onbemande opslaglocaties. Honest automation: online booking beschikbaar, ID/contracts/payment/access op roadmap met fallback denken.",
  alternates: { canonical: pageUrl("/onbemande-self-storage-software") }
};

export default function UnmannedStoragePage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-white">
        {/* Hero: Zero-touch concept */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 lg:py-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Onbemande workflows</p>
              <h1 className="text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl">
                Zero-touch move-in
              </h1>
              <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                Voor onbemande self-storage locaties waar klanten online reserveren, hun gegevens invullen, contracten afwerken en toegang krijgen—alles zonder iemand spreekt met je baliemedewerkering. We zeggen eerlijk wat vandaag werkt en wat op roadmap staat.
              </p>
            </div>
          </div>
        </section>

        {/* The challenge */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-slate-950 mb-8">
              Waarom onbemande locaties anders zijn
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Lagere loonkosten",
                  description: "Onbemande locaties hebben minder baliewerk—maar vragen om sterke workflows en exceptions."
                },
                {
                  title: "Permanente beschikbaarheid",
                  description: "Klanten verwachten 24/7 boeken, confirmatie en toegang. Geen wachtlijsten op kantooruren."
                },
                {
                  title: "Mobiel-first experience",
                  description: "Elke stap moet duidelijk zijn op telefoon. QR-codes, PIN's, e-mail verificatie—allemaal moet werken zonder ondersteuning."
                },
                {
                  title: "Exception handling",
                  description: "Als ID ontbreekt, contract niet afgerond is, betaling faalt—wat nu? Fallbacks moeten ingebouwd zijn."
                },
                {
                  title: "Audit trail",
                  description: "Wie deed wat, wanneer, en waarom? Onbemande locaties moeten volledig auditeerbaar zijn."
                },
                {
                  title: "Emergency override",
                  description: "Hardware falalt, PIN werkt niet, QR kapot. Je hebt nodig: nood-PIN, nood-QR, telefonische fallback."
                }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The workflow */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <h2 className="text-3xl font-semibold text-slate-950 mb-8">
            De zero-touch workflow (met eerlijke roadmap labels)
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Klant bezoekt je website",
                description: "QR-code, link, of Google Business Profile Link leidt naar hosted StorageYield booking page.",
                status: "Beschikbaar",
                statusColor: "bg-emerald-100 text-emerald-700"
              },
              {
                step: "2",
                title: "Online reservering & gegevens",
                description: "Klant kiest unit, voert naam in, e-mail, telefoonnummer. Bevestiging per e-mail.",
                status: "Beschikbaar",
                statusColor: "bg-emerald-100 text-emerald-700"
              },
              {
                step: "3",
                title: "ID verificatie (roadmap)",
                description: "itsme integratie of ID upload voorbereid. Voor nu: handmatige verificatie of overgeslagen (met risico-tag).",
                status: "Roadmap",
                statusColor: "bg-slate-100 text-slate-700"
              },
              {
                step: "4",
                title: "Contract afwerking (roadmap)",
                description: "E-signatures en multi-language termijn-templates op roadmap. Voor nu: PDF via e-mail + handtekening.",
                status: "Roadmap",
                statusColor: "bg-slate-100 text-slate-700"
              },
              {
                step: "5",
                title: "Betaling (roadmap)",
                description: "iDEAL/Bancontact readiness planned. Voor nu: handmatige overmaking of andere method.",
                status: "Roadmap",
                statusColor: "bg-slate-100 text-slate-700"
              },
              {
                step: "6",
                title: "Toegang (roadmap)",
                description: "PIN, QR-code, of mobile unlock via StorageYield app. Voor nu: PIN per e-mail of voicemail.",
                status: "Roadmap",
                statusColor: "bg-slate-100 text-slate-700"
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-slate-600">{item.description}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ml-4 ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exception handling - the reality */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 md:p-12">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-8 w-8 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    Onbemande locaties zonder exceptions zijn gevaarlijk
                  </h2>
                  <p className="mt-3 text-lg text-slate-700 mb-6">
                    ID systeem down? PIN hardware kapot? Klant kan niet in. Deze situaties moeten voorkomen zijn.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      "PIN fallback (voicemail/SMS)",
                      "QR fallback (e-mail stuur PIN)",
                      "Emergency override access (nood-sleutel/baliemedewerker)",
                      "Volledig audit log (wie accessed, when, how)",
                      "Manual escalation queue",
                      "Payment non-payment suspension workflow"
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <span className="text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's available now */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Available */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">Beschikbaar nu</h3>
                <p className="mt-2 text-lg text-slate-600">
                  Start je zero-touch workflow vandaag nog.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "Hosted booking page (QR, link, iframe)",
                  "Online reservering & unit selectie",
                  "Email confirmatie",
                  "PDF contract generatie",
                  "Manual fallback support",
                  "Exception queue visibility"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-semibold text-slate-950">In development</h3>
                <p className="mt-2 text-lg text-slate-600">
                  Gebouwd voor echte zero-touch, niet voor valse claims.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  "itsme & ID verification",
                  "E-signatures & contract workflows",
                  "iDEAL & Bancontact payments",
                  "PIN & QR access systems",
                  "Mobile unlock app",
                  "Emergency override protocols"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <Lock className="h-6 w-6 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Operators talking */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-[1400px] px-5">
            <h2 className="text-3xl font-semibold text-slate-950 mb-12 text-center">
              Wat operators zeggen over zero-touch
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "Onbemande werkt alleen als exceptions zichtbaar zijn. We gebruiken StorageYield voor die visibility.",
                  role: "Manager, 250-unit facility",
                  label: "Zichtbaarheid"
                },
                {
                  quote: "Ons systeem crashte vorig jaar. Nu willen we redundancy built in, niet bolted on achteraf.",
                  role: "Owner, multi-site operator",
                  label: "Betrouwbaarheid"
                },
                {
                  quote: "Klanten verwachten 24/7 toegang. Onze baliemedewerkering kan dat niet geven—software moet.",
                  role: "Operations lead",
                  label: "Beschikbaarheid"
                }
              ].map((item) => (
                <div key={item.role} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <p className="text-lg italic text-slate-700">&quot;{item.quote}&quot;</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-600">{item.role}</p>
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[1400px] px-5 py-16">
          <FaqSection
            faqs={[
              {
                question: "Hoe voorkomen we breuken in de workflow?",
                answer: "Fallbacks gebouwd in op elk moment: email PIN, voicemail opties, manual override. Geen stap mag volledig automation zijn zonder backup."
              },
              {
                question: "Wat als itsme niet beschikbaar is?",
                answer: "We label dit eerlijk als roadmap. Voor nu: PDF upload of handmatige verificatie door je team met risk-tag in systeem."
              },
              {
                question: "Kunnen we payments handmatig doen?",
                answer: "Ja. StorageYield volgt betaalstatus en kan escalatie triggeren als betaling uitstaat. Handmatige verwerking is workflow-ready."
              },
              {
                question: "Hoe werkt audit trail voor onbemande?",
                answer: "Elk access attempt, PIN try, QR scan wordt gelogd met timestamp. Essentieel voor Security & compliance."
              },
              {
                question: "Kan ik starten met just booking?",
                answer: "Ja. Start met hosted booking page + e-mail confirmatie. Voeg resource management, exceptions, en ladder up naarmate je comfort groeit."
              }
            ]}
          />
        </section>

        {/* CTA */}
        <section className="bg-slate-950 py-16">
          <div className="mx-auto max-w-[1240px] px-5 text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              Bouw een veilige zero-touch workflow
            </h2>
            <p className="mt-6 text-xl text-slate-300">
              Start met online booking. Voeg exceptions en fallbacks stap voor stap toe.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="mailto:hello@storageyield.com" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-500">
                Plan demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-sm hover:bg-slate-50">
                Bekijk demo
              </Link>
            </div>
          </div>
        </section>

        {/* Related pages */}
        <section className="mx-auto max-w-[1400px] px-5 py-8">
          <div className="flex flex-wrap gap-2">
            <Link href="/self-storage-toegangscontrole" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Toegangscontrole
            </Link>
            <Link href="/digitaal-contract-opslagruimte" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Digitale contracten
            </Link>
            <Link href="/self-storage-facturatie" className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Facturatie
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <OrganizationJsonLd />
      <SoftwareJsonLd url={pageUrl("/onbemande-self-storage-software")} description="Zero-touch move-in workflows voor onbemande opslaglocaties. Honest automation: online booking beschikbaar, ID/contracts/payment/access op roadmap." />
    </>
  );
}
