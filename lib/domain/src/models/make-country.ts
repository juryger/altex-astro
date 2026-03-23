import { z } from "zod";

const MakeCountrySchema = z.object({
  id: z.number(),
  uid: z.string(),
  title: z.string(),
  deletedAt: z.date().optional(),
});

export type MakeCountry = z.infer<typeof MakeCountrySchema>;
