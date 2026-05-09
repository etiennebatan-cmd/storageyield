const roadmap = [
  { title: "Betalingen", copy: "iDEAL, Bancontact, SEPA en kaartbetalingen staan als Benelux-roadmap, niet als live claim." },
  { title: "Identiteit en contract", copy: "itsme, ID-verificatie en e-signature zijn voorbereid als pilot-workflows met handmatige fallback." },
  { title: "Toegang", copy: "Hardware-agnostische toegangsworkflows met PIN, QR en mobile unlock als integratierichting." },
  { title: "PMS/import", copy: "CSV, PMS export-import en Google Sheets sync zijn de praktische eerste integratierichtingen." }
];

export function IntegrationsRoadmapSection() {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-12">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-600">Roadmap zonder overclaim</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Lokale integraties, eerlijk gepositioneerd</h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          StorageYield is pilot-ready voor booking en revenue intelligence. Lokale betaal-, contract- en toegangsautomatisering wordt per operator voorbereid.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {roadmap.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
