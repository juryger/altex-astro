import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  imageUrl: z.string(),
  parentId: z.number().optional(),
  parentSlug: z.string().optional(),
  parentTitle: z.string().optional(),
  totalProducts: z.number(),
});

const CategoryCacheSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  parentId: z.number().optional(),
  parentSlug: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CategoryCache = z.infer<typeof CategoryCacheSchema>;
