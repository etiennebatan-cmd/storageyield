import { redirect } from "next/navigation";

export default function FacilityCompetitorsRedirectPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/market-radar?demo=1" : "/app/market-radar");
}
