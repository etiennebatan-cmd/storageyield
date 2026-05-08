"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { widgetBookingSchema, WidgetBookingInput } from "@/lib/validators/widget";
import { updateDemoState } from "@/lib/demo-state";

export function WidgetForm({
  facility,
  unitTypes
}: {
  facility: { id: string; name?: string };
  unitTypes: Array<{ id: string; name: string; size_m2: number; description: string | null; current_street_rate_monthly: number; availability_count: number }>;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const form = useForm<WidgetBookingInput>({
    resolver: zodResolver(widgetBookingSchema),
    defaultValues: {
      facility_id: facility.id,
      unit_type_id: unitTypes[0]?.id,
      customer_type: "private"
    }
  });
  const onSubmit = async (values: WidgetBookingInput) => {
    setMessage("");
    const res = await fetch("/api/widget/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values)
    });
    if (res.ok) {
      const data = await res.json();
      const unitType = unitTypes.find((unit) => unit.id === values.unit_type_id);
      if (values.facility_id.startsWith("f") || data.booking_id?.startsWith("demo-booking")) {
        updateDemoState((current) => ({
          ...current,
          bookings: [
            {
              id: data.booking_id ?? `demo-booking-${Date.now()}`,
              customer_name: values.customer_name,
              customer_type: values.customer_type,
              unit_type_id: values.unit_type_id,
              unit_type_name: unitType?.name ?? "Storage unit",
              facility_id: values.facility_id,
              facility_name: facility.name ?? "Brussels North Storage",
              preferred_move_in_date: values.preferred_move_in_date ?? new Date().toISOString().slice(0, 10),
              quoted_monthly_rate: unitType?.current_street_rate_monthly ?? 0,
              source: "booking widget",
              status: "requested",
              created_at: new Date().toISOString(),
              next_action: "Contact within 10 minutes and reserve best available unit"
            },
            ...current.bookings
          ],
          activity: [
            {
              id: `activity-${Date.now()}`,
              title: "Booking widget submitted",
              description: `${values.customer_name} requested ${unitType?.name ?? "a unit"}.`,
              type: "booking",
              created_at: new Date().toISOString()
            },
            ...current.activity
          ]
        }));
      }
      setSubmitted(true);
      return;
    }
    setMessage("Could not send the booking request. Please check the fields and try again.");
  };
  if (submitted) return <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Thanks. The facility will contact you shortly to confirm availability.</div>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <label className="block text-sm font-medium">Unit type</label>
      <select className="w-full rounded-xl border border-slate-300 p-3 text-sm" {...form.register("unit_type_id")}>
        {unitTypes.map((ut) => (
          <option key={ut.id} value={ut.id}>
            {ut.name} ({ut.size_m2} m²) - EUR {ut.current_street_rate_monthly}/month - {ut.availability_count} available
          </option>
        ))}
      </select>
      <input className="w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="Full name" {...form.register("customer_name")} />
      <input className="w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="Email" {...form.register("customer_email")} />
      <input className="w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="Phone (optional)" {...form.register("customer_phone")} />
      <select className="w-full rounded-xl border border-slate-300 p-3 text-sm" {...form.register("customer_type")}>
        <option value="private">Private</option>
        <option value="business">Business</option>
        <option value="unknown">Unknown</option>
      </select>
      <input className="w-full rounded-xl border border-slate-300 p-3 text-sm" type="date" {...form.register("preferred_move_in_date")} />
      <textarea className="min-h-24 w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="Message (optional)" {...form.register("message")} />
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
      <button className="w-full rounded-xl bg-slate-950 p-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 active:translate-y-0" type="submit">Submit booking request</button>
    </form>
  );
}
