import { z } from "astro/zod";

export const GuestUserSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  compnayName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postCode: z.string().optional(),
  createdAt: z.date().optional(),
});

export type GuestUser = z.infer<typeof GuestUserSchema>;
