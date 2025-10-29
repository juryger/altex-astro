import { z } from "astro/zod";

export const ProductSchema = z.object({
  id: z.string(), //.uuid()
  title: z.string(),
  description: z.string().optional(),
  unit: z.string().optional(), //z.enum(['шт', 'упак', 'пар', 'набор', 'т', 'кг', 'г', 'л', 'м', 'м2', 'м3']).default('шт'),
  quantityInPack: z.number().default(1),
  price: z.number().default(0),
  whsPrice1: z.number().default(0),
  whsPrice2: z.number().default(0),
  categoryId: z.string(), //reference('categories'), //.uuid()
  categorySlug: z.string(),
  colors: z.array(z.string()),
  //  z.enum([
  //   'хром', 'бронза', 'золото', 'серебро', 'черный', 'белый', 'красный', 'синий', 'зеленый', 'желтый', 'коричневый', 'прозрачный',
  //   'по умолчанию'
  // ]).default('по умолчанию'),
  image: z.string(), //.url(),
  slug: z.string(),
  //relatedProdcuts: z.array(z.string()), //z.array(reference('products').optional()),
});

export type Product = z.infer<typeof ProductSchema>;
