import { z } from "zod";

const MeasurementUnitSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
});

export type MeasurementUnit = z.infer<typeof MeasurementUnitSchema>;
