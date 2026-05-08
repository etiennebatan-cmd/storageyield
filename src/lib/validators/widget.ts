import { z } from "zod";

export const widgetBookingSchema = z.object({
  facility_id: z.string().min(1),
  organization_id: z.string().uuid().optional(),
  unit_type_id: z.string().min(1),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().optional().nullable(),
  customer_type: z.enum(["private", "business", "unknown"]),
  preferred_move_in_date: z.string().optional().nullable(),
  message: z.string().optional().nullable()
});

export type WidgetBookingInput = z.infer<typeof widgetBookingSchema>;
