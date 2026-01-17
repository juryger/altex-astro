import { z } from "astro/zod";

export const CategoryCacheSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  parentId: z.number().optional(),
  parentSlug: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  slug: z.string(),
  parentId: z.number().optional(),
  parentSlug: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryCache = z.infer<typeof CategoryCacheSchema>;
