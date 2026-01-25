import { z } from "astro/zod";

const DiscountSchema = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  fromSum: z.number(),
});

const DiscountMetadata: Array<{ sum: number; title: string }> = [
  { sum: 1, title: "Розница" },
  { sum: 30000, title: "Оптовая" },
  { sum: 100000, title: "Специальная" },
];

export { DiscountMetadata };
export type Discount = z.infer<typeof DiscountSchema>;
