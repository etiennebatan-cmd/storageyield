"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import type { StorageYieldWorkspace } from "@/components/app-shell/use-storageyield-workspace";
import { Button, LoadingSkeletonCards } from "@/components/app-shell/shared-ui";

export function WorkspaceGate({ workspace, children }: { workspace: StorageYieldWorkspace; children: ReactNode }) {
  if (workspace.loading) return <LoadingSkeletonCards />;
  if (workspace.error) {
    const authRequired = workspace.error.toLowerCase().includes("authentication");
    const onboardingRequired = workspace.error.toLowerCase().includes("onboarding") || workspace.error.toLowerCase().includes("organization");
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">{authRequired ? "Login required" : onboardingRequired ? "Workspace setup required" : "Workspace unavailable"}</h2>
        <p className="mt-2 text-sm text-slate-600">{workspace.error}</p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => workspace.refresh()} variant="secondary"><RefreshCw className="h-4 w-4" />Retry</Button>
          <Link className="inline-flex items-center rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white" href={authRequired ? "/login?next=/app/decisions" : "/onboarding"}>
            {authRequired ? "Login" : "Open onboarding"}
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      {workspace.demoMode ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          Demo workspace enabled. Production app routes use Supabase unless you pass <code>?demo=1</code>.
        </div>
      ) : null}
      {children}
    </>
  );
}
