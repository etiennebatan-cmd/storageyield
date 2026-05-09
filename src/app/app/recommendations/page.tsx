import { redirect } from "next/navigation";

export default function RecommendationsRedirectPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/decisions?demo=1" : "/app/decisions");
}
