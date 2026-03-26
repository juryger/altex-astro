import { z } from "zod";

const ProductColorSchema = z.object({
  id: z.number(),
  uid: z.string(),
  productId: z.number(),
  productUid: z.string(),
  colorId: z.number(),
  colorUid: z.string(),
  deletedAt: z.date().optional(),
});

export type ProductColor = z.infer<typeof ProductColorSchema>;
