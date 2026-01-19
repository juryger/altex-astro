import { createCatalogDb, eq } from "@/lib/dal";
import { categories } from "@/lib/dal/src/schema/catalog";
import type { Category } from "@/web/src/core/models/category";

export async function getCategories(): Promise<Category[]> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);
  const parentSq = db.select().from(categories).as("parent_sq");
  const result = await db
    .select()
    .from(categories)
    .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
    .limit(20)
    .offset(0);

  if (result.length === 0) return [];

  return result.map(
    (item) =>
      <Category>{
        id: item.categories.id,
        slug: item.categories.slug,
        title: item.categories.title,
        description: item.categories.description,
        imageUrl: "".concat(item.categories.uid, ".png"),
        parentId: item.categories.parentId,
        parentSlug: item.parent_sq?.slug,
      },
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);
  const parentSq = db.select().from(categories).as("parent_sq");
  const item = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
    .limit(1);

  if (item.length === 0) return undefined;
  const category = item[0];

  return <Category>{
    id: category.categories.id,
    slug: category.categories.slug,
    title: category.categories.title,
    description: category.categories.description,
    imageUrl: "".concat(category.categories.uid, ".png"),
    parentId: category.categories.parentId,
    parentSlug: category.parent_sq?.slug,
  };
}
