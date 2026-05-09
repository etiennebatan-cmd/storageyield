import { redirect } from "next/navigation";

export default function SettingsPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/data-integrations?demo=1" : "/app/data-integrations");
}
