import { createCatalogDb, eq, isNull } from "@/lib/dal";
import { categories } from "@/lib/dal/src/schema/catalog";
import type { Category } from "@/web/src/core/models/category";
import { constractNavigationPaths } from "../../utils/url-builder";

export async function getCategories(
  page: number,
  pageSize: number,
  skipParentMatch: boolean = false,
  parentSlug: string = "",
): Promise<Category[]> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);
  const parentSq = db.select().from(categories).as("parent_sq");
  var result = await db
    .select()
    .from(categories)
    .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
    .limit(pageSize)
    .offset(page)
    .where(
      !skipParentMatch
        ? parentSlug === ""
          ? isNull(parentSq.slug)
          : eq(parentSq.slug, parentSlug)
        : undefined,
    );

  if (result.length === 0) return [];

  return result.map(
    (item) =>
      <Category>{
        id: item.categories.id,
        slug: item.categories.slug,
        title: item.categories.title,
        description:
          item.categories.description !== null
            ? item.categories.description
            : undefined,
        imageUrl: constractNavigationPaths(
          import.meta.env.PUBLIC_BLOB_STORAGE_CATEGORIES_URL,
          item.categories.uid.concat(".png"),
        ),
        parentId:
          item.categories.parentId !== null
            ? item.categories.parentId
            : undefined,
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
  const result = item[0];

  return <Category>{
    id: result.categories.id,
    slug: result.categories.slug,
    title: result.categories.title,
    description:
      result.categories.description !== null
        ? result.categories.description
        : undefined,
    imageUrl: "".concat(result.categories.uid, ".png"),
    parentId:
      result.categories.parentId !== null
        ? result.categories.parentId
        : undefined,
    parentSlug: result.parent_sq?.slug,
  };
}
