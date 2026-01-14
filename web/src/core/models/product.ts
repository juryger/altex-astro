import { z } from "astro/zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  productCode: z.string(),
  description: z.string().optional(),
  unit: z.number().optional(),
  quantityInPack: z.number().default(1),
  minQuantityToBuy: z.number().default(1),
  price: z.number().default(0),
  whsPrice1: z.number().default(0),
  whsPrice2: z.number().default(0),
  categoryId: z.number(),
  categorySlug: z.string(),
  colors: z.array(z.number()).optional(),
  image: z.string(),
  slug: z.string(),
  makerId: z.number().optional(),
  countryMaker: z.number().optional(),
  relatedProdcuts: z.array(z.string()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
