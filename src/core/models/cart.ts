import { z } from "astro/zod";

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

export const CartCheckoutGuestUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  compnay: z.string(),
  address: z.string(),
  city: z.string(),
  postCode: z.string(),
});

export const CartCheckoutSchema = z.object({
  userId: z.number().optional(),
  guestUser: CartCheckoutGuestUserSchema.optional(),
  cart: z.array(CartSchema),
});

export type CartItem = z.infer<typeof CartSchema>;
export type CartCheckoutGuestUser = z.infer<typeof CartCheckoutGuestUserSchema>;
