import { z } from "astro/zod";
import { GuestUserSchema } from "./guest-user";

export const CartSchema = z
  .object({
    productId: z.number(),
    productCode: z.string(),
    title: z.string(),
    availableColors: z.array(z.number()).optional(),
    price: z.number(),
    whsPrice1: z.number(),
    whsPrice2: z.number(),
    image: z.string(),
    slug: z.string(),
    color: z.number().optional(),
    colorTitle: z.string().optional(),
    quantity: z.number(),
  })
  .transform((data) => ({
    ...data,
    // Derived properties
    id:
      data.color !== undefined
        ? `${data.productId}-${data.color}`
        : data.productId.toString(),
  }));

export const CartCheckoutRequestSchema = z.object({
  userId: z.number().optional(),
  guestUser: GuestUserSchema.optional(),
  cartContent: z.array(CartSchema),
});

export type CartItem = z.infer<typeof CartSchema>;
export type CartCheckoutRequest = z.infer<typeof CartCheckoutRequestSchema>;
