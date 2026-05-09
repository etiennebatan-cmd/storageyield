import { redirect } from "next/navigation";

export default function BookingsPage({ searchParams }: { searchParams?: { demo?: string } }) {
  redirect(searchParams?.demo === "1" ? "/app/booking-conversion?demo=1" : "/app/booking-conversion");
}
