import { z } from "zod";

const ProductColorSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  fillColor: z.string(),
  borderColor: z.string(),
  uid: z.string(),
});

export type ProductColor = z.infer<typeof ProductColorSchema>;
