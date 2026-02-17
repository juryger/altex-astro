import { z } from "astro/zod";

export const CartCheckoutSchema = z.object({
  id: z.number().optional(),
  userId: z.number().optional(),
  guestId: z.number().optional(),
  discountId: z.number(),
  createdAt: z.date().optional(),
});

export const CartCheckoutItemSchema = z.object({
  id: z.number().optional(),
  cartCheckoutId: z.number(),
  productId: z.number(),
  colorId: z.number().optional(),
  quantity: z.number(),
  price: z.number(),
});

export type CartCheckout = z.infer<typeof CartCheckoutSchema>;
export type CartCheckoutItem = z.infer<typeof CartCheckoutItemSchema>;
