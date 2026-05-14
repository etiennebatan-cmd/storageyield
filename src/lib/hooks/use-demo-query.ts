"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function useDemoQuery() {
  const searchParams = useSearchParams();
  return useMemo(() => searchParams?.get("demo") === "1", [searchParams]);
}
