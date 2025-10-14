import { z, reference, defineLiveCollection } from 'astro:content';
import { createCategoriesLoader } from './loaders/categories-loader';
import { createProductsLoader } from './loaders/products-loader';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:4321/api';

const categories = defineLiveCollection({
  loader: createCategoriesLoader({ baseUrl: API_BASE_URL }),
  // schema: z
  //   .object({
  //     id: z.number(),
  //     title: z.string(),
  //     description: z.string().optional(),
  //     image: z.string(),//.url(),
  //     slug: z.string(),
  //     parent: z.string().optional(),//reference('categories').optional(),
  //   })
  //   .transform((data) => ({
  //     ...data,
  //   })),
});

const products = defineLiveCollection({
  loader: createProductsLoader({ baseUrl: API_BASE_URL }),
  // schema: z
  //   .object({
  //     id: z.number(),
  //     title: z.string(),
  //     description: z.string().optional(),
  //     unit: z.enum(['шт', 'упак', 'пар', 'набор', 'т', 'кг', 'г', 'л', 'м', 'м2', 'м3']).default('шт'),
  //     quantityInPack: z.number().default(1),
  //     price: z.number().default(0),
  //     whsPrice1: z.number().default(0),
  //     whsPrice2: z.number().default(0) ,
  //     category: z.string(),//reference('categories'),
  //     colors: z.enum([
  //       'хром', 'бронза', 'золото', 'серебро', 'черный', 'белый', 'красный', 'синий', 'зеленый', 'желтый', 'коричневый', 'прозрачный', 
  //       'по умолчанию'
  //     ]).default('по умолчанию'),
  //     image: z.string(),//.url(),
  //     slug: z.string(),
  //     relatedProdcuts: z.array(z.string()), //z.array(reference('products').optional()),
  //   })
  //   .transform((data) => ({
  //     ...data,
  //   })),
});

export const collections = { categories, products };