import {
  createCatalogDb,
  eq,
  isNull,
  asc,
  desc,
  type SQLiteColumn,
  SQL,
} from "@/lib/dal";
import { categories, products } from "@/lib/dal/src/schema/catalog";
import type { Category as DbCategory } from "@/lib/dal/src/types";
import type { Category } from "@/web/src/core/models/category";
import { constractNavigationPaths } from "@/web/src/core/utils/url-builder";
import { NO_IMAGE_FILE_NAME, SortOrder } from "@/web/src/core/const";
import type { Paging } from "@/web/src/core/models/paging";
import type { Sorting } from "@/web/src/core/models/sorting";

const columnId: SQLiteColumn = categories.id;
const columnTitle: SQLiteColumn = categories.title;

const getSortCondition = (value: Sorting): SQL => {
  const column = value.field.toLowerCase() === "title" ? columnTitle : columnId;
  return value.order.toLowerCase() === SortOrder.Ascending
    ? asc(column)
    : desc(column);
};

type QueryResult = {
  categories: DbCategory;
  parentSlug?: string | null;
  parentTitle?: string | null;
  totalProducts: number;
  totalProductsSub: number;
};

const mapQueryResultToDomainModel = (entity: QueryResult): Category => {
  return <Category>{
    id: entity.categories.id,
    slug: entity.categories.slug,
    title: entity.categories.title,
    description:
      entity.categories.description !== null
        ? entity.categories.description
        : undefined,
    imageUrl: constractNavigationPaths(
      import.meta.env.PUBLIC_BLOB_STORAGE_CATEGORIES_URL,
      entity.categories.hasImage
        ? entity.categories.uid.concat(".png")
        : NO_IMAGE_FILE_NAME,
    ),
    parentId:
      entity.categories.parentId !== null
        ? entity.categories.parentId
        : undefined,
    parentSlug: entity.parentSlug !== null ? entity.parentSlug : undefined,
    parentTitle: entity.parentTitle !== null ? entity.parentTitle : undefined,
    totalProducts: entity.totalProducts + entity.totalProductsSub,
  };
};

export async function fetchCategories(
  skipParentMatch: boolean = false,
  parentSlug: string = "",
  sorting: Sorting,
  paging: Paging,
): Promise<Category[]> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);

  const parentSq = db.select().from(categories).as("parent_sq");
  const productSq = db
    .select()
    .from(categories)
    .innerJoin(products, eq(categories.id, products.categoryId))
    .as("child_sq");
  const queryResult = await db
    .select({
      categories: { ...categories },
      parentSlug: parentSq.slug,
      parentTitle: parentSq.title,
      totalProducts: db.$count(
        products,
        eq(products.categoryId, categories.id),
      ),
      totalProductsSub: db.$count(
        productSq,
        eq(categories.id, productSq.categories.parentId),
      ),
    })
    .from(categories)
    .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
    .where(
      !skipParentMatch
        ? parentSlug === ""
          ? isNull(parentSq.slug)
          : eq(parentSq.slug, parentSlug)
        : undefined,
    )
    .orderBy(getSortCondition(sorting))
    .limit(paging.pageSize)
    .offset(paging.page);

  if (queryResult.length === 0) return [];

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);

  const parentSq = db.select().from(categories).as("parent_sq");
  const productSq = db
    .select()
    .from(categories)
    .innerJoin(products, eq(categories.id, products.categoryId))
    .as("child_sq");
  const queryResult = await db
    .select({
      categories: { ...categories },
      parentSlug: parentSq.slug,
      parentTitle: parentSq.title,
      totalProducts: db.$count(
        products,
        eq(products.categoryId, categories.id),
      ),
      totalProductsSub: db.$count(
        productSq,
        eq(categories.id, productSq.categories.parentId),
      ),
    })
    .from(categories)
    .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
    .where(eq(categories.slug, slug))
    .limit(1);

  if (queryResult.length === 0) return undefined;
  return mapQueryResultToDomainModel(queryResult[0]);
}
