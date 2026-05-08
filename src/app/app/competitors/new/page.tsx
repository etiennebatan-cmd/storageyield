import Link from "next/link";
import { AddCompetitorForm } from "@/components/app/competitor-forms";
import { demoFacilities } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/demo-mode";
import { createClient } from "@/lib/supabase/server";

export default async function NewCompetitorPage() {
  if (isDemoMode()) {
    return (
      <div className="space-y-5">
        <div>
          <Link className="text-sm text-slate-600 underline-offset-2 hover:underline" href="/app/market-radar">Back to Market Radar</Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Add competitor</h1>
          <p className="text-sm text-slate-600">Track only the competitors you choose. Nearby operators are not used unless you add and assign them.</p>
        </div>
        <AddCompetitorForm demoMode facilities={demoFacilities.map((facility) => ({ id: facility.id, name: facility.name }))} />
      </div>
    );
  }

  const supabase = createClient();
  const { data: facilities } = await supabase.from("facilities").select("id,name").order("name");
  const facilityOptions = (facilities ?? []).map((facility) => ({ id: facility.id, name: facility.name }));

  return (
    <div className="space-y-5">
      <div>
        <Link className="text-sm text-slate-600 underline-offset-2 hover:underline" href="/app/market-radar">Back to Market Radar</Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add competitor</h1>
        <p className="text-sm text-slate-600">Track only the competitors you choose. Nearby operators are not used unless you add and assign them.</p>
      </div>
      {facilityOptions.length ? (
        <AddCompetitorForm facilities={facilityOptions} />
      ) : (
        <div className="panel p-5 text-sm text-slate-600">Create a facility before adding tracked competitors.</div>
      )}
    </div>
  );
}
