import { z } from "zod";

const DiscountSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  fromSum: z.number(),
});

export type Discount = z.infer<typeof DiscountSchema>;
