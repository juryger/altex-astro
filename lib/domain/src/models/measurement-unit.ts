import { z } from "zod";

const MeasurementUnitSchema = z.object({
  id: z.number(),
  uid: z.string(),
  code: z.string(),
  title: z.string(),
  deletedAt: z.date().optional(),
});

export type MeasurementUnit = z.infer<typeof MeasurementUnitSchema>;
