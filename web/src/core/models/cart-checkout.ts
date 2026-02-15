import { z } from "astro/zod";

export const CartCheckoutSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number().optional(),
  guestId: z.number().optional(),
  discountId: z.number(),
  createdAt: z.date(),
});

export const CartCheckoutItemSchema = z.object({
  id: z.number(),
  cartCheckoutId: z.number(),
  productId: z.number(),
  colorId: z.number().optional(),
  quantity: z.number(),
});

export type CartCheckout = z.infer<typeof CartCheckoutSchema>;
export type CartCheckoutItem = z.infer<typeof CartCheckoutItemSchema>;
