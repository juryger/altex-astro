import {
  createCatalogDb,
  eq,
  isNull,
  and,
  asc,
  desc,
  type SQLiteColumn,
  SQL,
} from "@/lib/dal";
import type { Category as DbCategory } from "@/lib/dal";
import { categories, products } from "@/lib/dal";
import type { PageResult, Paging, Sorting, Category } from "@/lib/domain";
import {
  CategoriesSortFields,
  constructNavigationPath,
  EnvironmentNames,
  NO_IMAGE_FILE_NAME,
  selectEnvironment,
  SortOrder,
} from "@/lib/domain";

const columnId: SQLiteColumn = categories.id;
const columnTitle: SQLiteColumn = categories.title;

const getSortCondition = (value: Sorting): SQL => {
  const column =
    value.field.toLowerCase() === CategoriesSortFields.Title
      ? columnTitle
      : columnId;
  return value.order === SortOrder.Ascending ? asc(column) : desc(column);
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
    imageUrl: constructNavigationPath({
      args: [
        selectEnvironment(EnvironmentNames.PUBLIC_BLOB_STORAGE_CATEGORIES_URL),
        entity.categories.hasImage
          ? entity.categories.uid.concat(".png")
          : NO_IMAGE_FILE_NAME,
      ],
    }),
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
): Promise<PageResult<Category>> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );

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
      and(
        isNull(categories.deletedAt),
        !skipParentMatch
          ? parentSlug === ""
            ? isNull(parentSq.slug)
            : eq(parentSq.slug, parentSlug)
          : undefined,
      ),
    )
    .orderBy(getSortCondition(sorting))
    .limit(paging.pageSize)
    .offset(paging.page * paging.pageSize);

  const totalCount = await db.$count(
    db
      .select()
      .from(categories)
      .leftJoin(parentSq, eq(categories.parentId, parentSq.id))
      .where(
        and(
          isNull(categories.deletedAt),
          !skipParentMatch
            ? parentSlug === ""
              ? isNull(parentSq.slug)
              : eq(parentSq.slug, parentSlug)
            : undefined,
        ),
      ),
  );

  return {
    items: queryResult.map((item) =>
      mapQueryResultToDomainModel(item as QueryResult),
    ),
    pageInfo: {
      total: totalCount,
      page: paging.page,
      pageSize: paging.pageSize,
      hasMore: (paging.page + 1) * paging.pageSize < totalCount,
    },
  } as PageResult<Category>;
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );

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
    .where(and(isNull(categories.deletedAt), eq(categories.slug, slug)))
    .limit(1);

  const item = queryResult[0];
  if (item === undefined) return undefined;
  return mapQueryResultToDomainModel(item as QueryResult);
}
