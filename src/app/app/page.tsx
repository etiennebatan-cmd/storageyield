import { redirect } from "next/navigation";

export default function DecisionInboxPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/decisions?demo=1" : "/app/decisions");
}
