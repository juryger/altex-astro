import { z } from "zod";

const DiscountSchema = z.object({
  id: z.number(),
  uid: z.string(),
  fromSum: z.number(),
  title: z.string(),
  deletedAt: z.date().optional(),
});

export type Discount = z.infer<typeof DiscountSchema>;
