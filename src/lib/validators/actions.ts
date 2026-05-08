import { z } from "zod";

export const leadStatusSchema = z.object({
  lead_id: z.string().uuid(),
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
  organization_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional()
});

export const recommendationStatusSchema = z.object({
  recommendation_id: z.string().uuid(),
  status: z.enum(["open", "accepted", "dismissed", "completed"]),
  organization_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional()
});

export const unitUpdateSchema = z.object({
  unit_id: z.string().uuid(),
  organization_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional(),
  status: z.enum(["available", "occupied", "reserved", "maintenance", "unavailable"]).optional(),
  current_rent_monthly: z.number().nullable().optional()
});

export const bookingStatusSchema = z.object({
  booking_id: z.string().uuid(),
  status: z.enum(["requested", "reserved", "approved", "rejected", "cancelled", "converted"]),
  organization_id: z.string().uuid().optional(),
  facility_id: z.string().uuid().optional(),
  selected_unit_id: z.string().uuid().nullable().optional(),
  quoted_monthly_rate: z.number().nullable().optional()
});
