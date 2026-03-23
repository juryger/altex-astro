import { z } from "zod";

const ColorSchema = z.object({
  id: z.number(),
  uid: z.string(),
  code: z.string(),
  title: z.string(),
  fillColor: z.string(),
  borderColor: z.string(),
  deletedAt: z.date().optional(),
});

export type Color = z.infer<typeof ColorSchema>;
