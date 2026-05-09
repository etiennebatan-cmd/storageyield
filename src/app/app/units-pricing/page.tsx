import { redirect } from "next/navigation";

export default function UnitsPricingPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/pricing-lab?demo=1" : "/app/pricing-lab");
}
