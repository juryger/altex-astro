import { z } from "zod";
import type { GuestUser } from "./guest-user";

const CartCheckoutSchema = z.object({
  id: z.number().optional(),
  userId: z.string().optional(),
  guestId: z.string().optional(),
  createdAt: z.date().optional(),
});

const CartCheckoutItemSchema = z.object({
  id: z.number().optional(),
  cartCheckoutId: z.number(),
  productId: z.number(),
  colorId: z.number().optional(),
  quantity: z.number(),
  price: z.number(),
});

export type CartCheckout = z.infer<typeof CartCheckoutSchema>;
export type CartCheckoutItem = z.infer<typeof CartCheckoutItemSchema>;

export type CartCheckoutAggregate = {
  root: CartCheckout;
  items: Array<CartCheckoutItem>;
  guest?: GuestUser | undefined;
  customer?: any | undefined;
};
