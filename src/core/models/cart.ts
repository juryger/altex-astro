import { z } from "astro/zod";

export const CartSchema = z.object({
  id: z.number(),
  title: z.string(),
  unit: z.number().optional(),
  quantityInPack: z.number().default(1),
  minQuantityToBuy: z.number().default(1),
  orderQuantity: z.number().default(1),
  price: z.number().default(0),
  whsPrice1: z.number().default(0),
  whsPrice2: z.number().default(0),
  colors: z.array(z.number()).optional(),
  image: z.string(),
  slug: z.string(),
});

export type CartItem = z.infer<typeof CartSchema>;
