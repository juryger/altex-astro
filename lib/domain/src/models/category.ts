import { z } from "zod";

export const CategorySchema = z.object({
  id: z.number(),
  uid: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  hasImage: z.number().optional(),
  imageUrl: z.string(),
  thumbnailImageUrl: z.string(),
  parentId: z.number().optional(),
  parentUid: z.string().optional(),
  parentSlug: z.string().optional(),
  parentTitle: z.string().optional(),
  totalProducts: z.number(),
  createdAt: z.date(),
  modifiedAt: z.date(),
  deletedAt: z.date().optional(),
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
