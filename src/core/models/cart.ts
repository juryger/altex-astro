import { z } from "astro/zod";

export const CartSchema = z.object({
  id: z.string(),
  productId: z.number(),
  quantity: z.number(),
  color: z.number().optional(),
});

export type CartItem = z.infer<typeof CartSchema>;

export type CartDictionary = {
  [key: string]: CartItem | undefined;
};
