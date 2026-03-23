import { z } from "zod";

const ProductColorSchema = z.object({
  id: z.number(),
  uid: z.string(),
  productId: z.number(),
  colorId: z.number(),
  deletedAt: z.date().optional(),
});

export type ProductColor = z.infer<typeof ProductColorSchema>;
