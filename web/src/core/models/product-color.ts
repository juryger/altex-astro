import { z } from "astro/zod";

const ProductColorSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  fillColor: z.string(),
  borderColor: z.string(),
});

export type ProductColor = z.infer<typeof ProductColorSchema>;
