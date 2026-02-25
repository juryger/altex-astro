import { z } from "zod";
import { GuestUserSchema } from "./guest-user";

export const CartSchema = z
  .object({
    productId: z.number(),
    productUid: z.string(),
    productCode: z.string(),
    title: z.string(),
    availableColors: z.array(z.number()).optional(),
    price: z.number(),
    whsPrice1: z.number(),
    whsPrice2: z.number(),
    image: z.string(),
    slug: z.string(),
    colorId: z.number().optional(),
    colorUid: z.string().optional(),
    colorTitle: z.string().optional(),
    quantity: z.number(),
  })
  .transform((data) => ({
    ...data,
    // Derived properties
    id:
      data.colorId !== undefined
        ? `${data.productId}-${data.colorId}`
        : data.productId.toString(),
  }));

export const CartCheckoutRequestSchema = z.object({
  userId: z.string().optional(),
  guestUser: GuestUserSchema.optional(),
  cartContent: z.array(CartSchema),
});

export type CartItem = z.infer<typeof CartSchema>;
export type CartCheckoutRequest = z.infer<typeof CartCheckoutRequestSchema>;
