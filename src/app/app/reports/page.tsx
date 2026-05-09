import { redirect } from "next/navigation";

export default function ReportsPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/impact-report?demo=1" : "/app/impact-report");
}
