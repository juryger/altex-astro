import { z } from "zod";

const DiscountSchema = z.object({
  id: z.number(),
  fromSum: z.number(),
  title: z.string(),
});

export type Discount = z.infer<typeof DiscountSchema>;
