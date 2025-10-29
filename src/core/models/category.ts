import { z } from "astro/zod";

export const CategoryCacheSchema = z.object({
  id: z.string(), //.uuid()
  title: z.string(),
  slug: z.string(),
  parentSlug: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string(), //.uuid(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string(), //.url(),
  slug: z.string(),
  parentId: z.string().optional(), //.uuid()
  parentSlug: z.string().optional(), //reference('categories').optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryCache = z.infer<typeof CategoryCacheSchema>;
