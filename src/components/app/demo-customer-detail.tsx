"use client";

import { useEffect, useState } from "react";
import { CustomerDetail } from "@/components/app/customer-detail";
import { getDemoPmsCustomerWithRelations } from "@/lib/demo-pms-state";
import type { Customer } from "@/lib/types";

interface DemoCustomerDetailProps {
  customerId: string;
}

export function DemoCustomerDetail({ customerId }: DemoCustomerDetailProps) {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    setCustomer(getDemoPmsCustomerWithRelations(customerId));
  }, [customerId]);

  if (!customer) {
    return <div className="p-4">Customer not found in demo workspace.</div>;
  }

  return <CustomerDetail customer={customer as Customer & any} />;
}
