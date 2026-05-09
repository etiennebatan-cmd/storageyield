import { CheckCircle2 } from "lucide-react";

const proof = [
  "Nederlands, Frans en Engels als uitgangspunt",
  "Ontworpen rond iDEAL, Bancontact en SEPA in de roadmap",
  "PEPPOL-ready en btw-bewuste workflowpositionering",
  "Geschikt voor self-storage, garageboxen, containers en hybride locaties"
];

export function BeneluxProofSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-700">Benelux-proof</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Waarom niet zomaar een UK/US-tool?</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          Benelux-operators hebben meertalige klanten, lokale betaalgewoontes, onbemande locaties en vaak een mix van units, garageboxen en containers.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {proof.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
