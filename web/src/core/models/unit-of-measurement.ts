import { z } from "astro/zod";

const UnitOfMeasurementSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
});

const UnitOfMeasurementDictionary: {
  [key: number]: { title: string };
} = {
  1: { title: "шт" },
  2: { title: "кор." },
  3: { title: "уп." },
  4: { title: "т" },
  5: { title: "кг" },
  6: { title: "гр" },
  7: { title: "л" },
  8: { title: "м" },
  9: { title: "м2" },
  10: { title: "м3" },
};

export { UnitOfMeasurementDictionary };
export type UnitOfMeasurement = z.infer<typeof UnitOfMeasurementSchema>;
