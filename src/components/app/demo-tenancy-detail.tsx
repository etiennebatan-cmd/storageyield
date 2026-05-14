"use client";

import { useEffect, useState } from "react";
import { TenancyDetail } from "@/components/app/tenancy-detail";
import { getDemoPmsTenancyWithRelations } from "@/lib/demo-pms-state";
import type { Tenancy } from "@/lib/types";

interface DemoTenancyDetailProps {
  tenancyId: string;
}

export function DemoTenancyDetail({ tenancyId }: DemoTenancyDetailProps) {
  const [tenancy, setTenancy] = useState<any>(null);

  useEffect(() => {
    setTenancy(getDemoPmsTenancyWithRelations(tenancyId));
  }, [tenancyId]);

  if (!tenancy) {
    return <div className="p-4">Tenancy not found in demo workspace.</div>;
  }

  return <TenancyDetail tenancy={tenancy as Tenancy & any} />;
}
