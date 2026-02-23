import type { Product, PageResult, Paging, Sorting } from "@/lib/domain";

import type {
  Product as DbProduct,
  Category as DbCategory,
  Maker as DbMaker,
  MakeCountry as DbMakeCountry,
  MeasurementUnit as DbMeasurementUnit,
  ProductColor as DbProductColor,
  SQLiteColumn,
} from "@/lib/dal";

import {
  ProductSchema,
  CategoriesSortFields,
  SortOrder,
  constructNavigationPath,
  NO_IMAGE_FILE_NAME,
  selectEnvironment,
  EnvironmentNames,
  ImageContainers,
  getEmptyPageResult,
} from "@/lib/domain";

import {
  createCatalogDb,
  eq,
  and,
  asc,
  desc,
  or,
  isNull,
  SQL,
  categories,
  makeCountries,
  makers,
  measurementUnits,
  productColors,
  products,
} from "@/lib/dal";

const columnId: SQLiteColumn = products.id;
const columnTitle: SQLiteColumn = products.title;
const columnPrice: SQLiteColumn = products.price;

const getSortCondition = (value: Sorting): SQL => {
  var column: SQLiteColumn | undefined;
  switch (value.field.toLowerCase()) {
    case CategoriesSortFields.Title:
      column = columnTitle;
      break;
    case CategoriesSortFields.Price:
      column = columnPrice;
      break;
    default:
      column = columnId;
  }
  return value.order === SortOrder.Ascending ? asc(column) : desc(column);
};

type ProductsQueryResult = {
  main: { products: DbProduct; categories: DbCategory };
  categories: DbCategory;
  measurement_units: DbMeasurementUnit | null;
  makers: DbMaker | null;
  make_countries: DbMakeCountry | null;
  product_colors: DbProductColor | null;
};

const mapQueryResultToDomainModel = (entity: ProductsQueryResult): Product => {
  const colorId = entity.product_colors?.colorId;
  return <Product>{
    id: entity.main.products.id,
    productCode: entity.main.products.productCode,
    slug: entity.main.products.slug,
    title: entity.main.products.title,
    description:
      entity.main.products.description !== null
        ? entity.main.products.description
        : undefined,
    unitId:
      entity.main.products.unitId !== undefined
        ? entity.main.products.unitId
        : undefined,
    unit: entity.measurement_units?.title,
    dimensionLengthMm:
      entity.main.products.dimensionLengthMm !== null
        ? entity.main.products.dimensionLengthMm
        : undefined,
    dimensionWidthMm:
      entity.main.products.dimensionWidthMm !== null
        ? entity.main.products.dimensionWidthMm
        : undefined,
    dimensionHeightMm:
      entity.main.products.dimensionHeightMm !== null
        ? entity.main.products.dimensionHeightMm
        : undefined,
    weightGr:
      entity.main.products.weightGr !== null
        ? entity.main.products.weightGr
        : undefined,
    quantityInPack: entity.main.products.quantityInPack,
    minQuantityToBuy: entity.main.products.minQuantityToBuy,
    price: entity.main.products.price,
    whsPrice1: entity.main.products.whsPrice1,
    whsPrice2: entity.main.products.whsPrice2,
    categoryId: entity.main.products.categoryId,
    categorySlug: entity.categories?.slug,
    categoryTitle: entity.categories?.title,
    colors: colorId !== undefined ? [colorId] : [],
    imageUrl: constructNavigationPath({
      args: [
        selectEnvironment(EnvironmentNames.PUBLIC_BLOB_STORAGE_PRODUCTS_URL),
        entity.main.products.hasImage
          ? entity.main.products.uid.concat(".png")
          : NO_IMAGE_FILE_NAME,
      ],
    }),
    thumbnailImageUrl: constructNavigationPath({
      args: [
        selectEnvironment(EnvironmentNames.PUBLIC_BLOB_STORAGE_PRODUCTS_URL),
        ImageContainers.Thumbnails,
        entity.main.products.hasImage
          ? entity.main.products.uid.concat(".png")
          : NO_IMAGE_FILE_NAME,
      ],
    }),
    makerId:
      entity.main.products.makerId !== null
        ? entity.main.products.makerId
        : undefined,
    maker: entity.makers?.title,
    makeCountryId:
      entity.main.products.makeCountryId !== null
        ? entity.main.products.makeCountryId
        : undefined,
    makeCountry: entity.make_countries?.title,
    createdAt: entity.main.products.createdAt,
    modifiedAt: entity.main.products.modifiedAt,
  };
};

export async function fetchProducts(
  categorySlug: string,
  sorting: Sorting,
  paging: Paging,
): Promise<PageResult<Product>> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );

  const parentCategorySq = db
    .select()
    .from(categories)
    .as("parent_category_sq");

  // NOTE: it's not a recursive CTE (only two levels), but can be implemented as mentioned here
  // https://github.com/drizzle-team/drizzle-orm/issues/209#issuecomment-2634760423
  const productsSq = db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(parentCategorySq, eq(categories.parentId, parentCategorySq.id))
    .where(
      and(
        isNull(categories.deletedAt),
        or(
          eq(categories.slug, categorySlug),
          eq(parentCategorySq.slug, categorySlug),
        ),
      ),
    )
    .orderBy(getSortCondition(sorting))
    .limit(paging.pageSize)
    .offset(paging.page * paging.pageSize)
    .as("main");

  const queryResult = await db
    .select()
    .from(productsSq)
    .innerJoin(categories, eq(productsSq.products.categoryId, categories.id))
    .leftJoin(
      productColors,
      eq(productsSq.products.id, productColors.productId),
    )
    .leftJoin(
      measurementUnits,
      eq(productsSq.products.unitId, measurementUnits.id),
    )
    .leftJoin(makers, eq(productsSq.products.makerId, makers.id))
    .leftJoin(
      makeCountries,
      eq(productsSq.products.makeCountryId, makeCountries.id),
    );

  if (queryResult.length === 0) return getEmptyPageResult<Product>();

  const totalCount = await db.$count(
    db
      .select()
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(parentCategorySq, eq(categories.parentId, parentCategorySq.id))
      .where(
        and(
          isNull(categories.deletedAt),
          or(
            eq(categories.slug, categorySlug),
            eq(parentCategorySq.slug, categorySlug),
          ),
        ),
      ),
  );

  var resultIndex = 0;
  const result: Product[] = Array(paging.pageSize);
  for (var i = 0; i < queryResult.length; i++) {
    const item = queryResult[i];
    if (item === undefined) continue;

    const colorId = item.product_colors?.colorId;
    const productIndex = result.findIndex(
      (x) => x !== undefined && x.id === item.main.products.id,
    );

    if (productIndex !== -1 && colorId !== undefined) {
      result[productIndex]?.colors?.push(colorId);
      continue;
    }

    const value = mapQueryResultToDomainModel(item as ProductsQueryResult);
    result[resultIndex++] = ProductSchema.parse(value);
  }

  return {
    items: result.filter((x) => x !== undefined),
    pageInfo: {
      total: totalCount,
      page: paging.page,
      pageSize: paging.pageSize,
      hasMore: (paging.page + 1) * paging.pageSize < totalCount,
    },
  } as PageResult<Product>;
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );

  const productsSq = db
    .select()
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(isNull(products.deletedAt), eq(products.slug, slug)))
    .limit(1)
    .as("main");

  var queryResult = await db
    .select()
    .from(productsSq)
    .innerJoin(categories, eq(productsSq.products.categoryId, categories.id))
    .leftJoin(
      measurementUnits,
      eq(productsSq.products.unitId, measurementUnits.id),
    )
    .leftJoin(makers, eq(productsSq.products.makerId, makers.id))
    .leftJoin(
      makeCountries,
      eq(productsSq.products.makeCountryId, makeCountries.id),
    )
    .leftJoin(
      productColors,
      eq(productsSq.products.id, productColors.productId),
    );

  if (queryResult.length === 0) return undefined;

  var resultIndex = 0;
  const result: Product[] = Array(1);
  for (var i = 0; i < queryResult.length; i++) {
    const item = queryResult[i];
    if (item === undefined) continue;

    const colorId = item.product_colors?.colorId;
    const productIndex = result.findIndex(
      (x) => x !== undefined && x.id === item.main.products.id,
    );

    if (productIndex !== -1 && colorId !== undefined) {
      result[productIndex]?.colors?.push(colorId);
      continue;
    }

    const value = mapQueryResultToDomainModel(item as ProductsQueryResult);
    result[resultIndex++] = ProductSchema.parse(value);
  }

  return result[0];
}
