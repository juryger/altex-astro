import {
  constructNavigationPath,
  EnvironmentNames,
  ImageContainers,
  NO_IMAGE_FILE_NAME,
  ReadReplicaTypes,
  SEARCH_RECORDS_LIMIT,
  SearchTypes,
  selectEnvironment,
} from "@/lib/domain";
import type { SearchResult } from "@/lib/domain";
import { ReadReplicaManager } from "../utils/read-replica-manager";
import {
  eq,
  isNull,
  categories,
  createCatalogDb,
  products,
  makeCountries,
} from "@/lib/dal";
import type {
  Category as DbCategory,
  Product as DbProduct,
  MakeCountry as DbMakeCountry,
} from "@/lib/dal";

type ProductsQueryResult = {
  make_countries: DbMakeCountry | null;
  products: DbProduct;
};

const mapCategoryQueryResultToDomainModel = (
  entity: DbCategory,
): SearchResult => {
  return {
    type: SearchTypes.Category,
    slug: entity.slug,
    title: entity.title,
    description: entity.description,
    thumbnailImageUrl: constructNavigationPath({
      args: [
        selectEnvironment(EnvironmentNames.PUBLIC_BLOB_STORAGE_CATALOG_URL),
        ImageContainers.Categories,
        ImageContainers.Thumbnails,
        entity.hasImage ? entity.uid.concat(".png") : NO_IMAGE_FILE_NAME,
      ],
    }),
  } as SearchResult;
};

const mapProductQueryResultToDomainModel = (
  entity: ProductsQueryResult,
): SearchResult => {
  return {
    type: SearchTypes.Product,
    slug: entity.products.slug,
    title: entity.products.title,
    description: entity.products.description,
    country: entity.make_countries?.title,
    price: entity.products.price,
    thumbnailImageUrl: constructNavigationPath({
      args: [
        selectEnvironment(EnvironmentNames.PUBLIC_BLOB_STORAGE_CATALOG_URL),
        ImageContainers.Products,
        ImageContainers.Thumbnails,
        entity.products.hasImage
          ? entity.products.uid.concat(".png")
          : NO_IMAGE_FILE_NAME,
      ],
    }),
  } as SearchResult;
};

export async function fetchAllCategories(): Promise<SearchResult[]> {
  const dbCatalogPath = ReadReplicaManager.instance().getFilePath(
    ReadReplicaTypes.Catalog,
  );
  const db = createCatalogDb(dbCatalogPath);

  const queryResult = await db
    .select()
    .from(categories)
    .where(isNull(categories.deletedAt))
    .orderBy(categories.title)
    .limit(SEARCH_RECORDS_LIMIT);

  return queryResult.map((item: DbCategory) =>
    mapCategoryQueryResultToDomainModel(item),
  ) as SearchResult[];
}

export async function fetchAllProducts(): Promise<SearchResult[]> {
  const dbCatalogPath = ReadReplicaManager.instance().getFilePath(
    ReadReplicaTypes.Catalog,
  );
  const db = createCatalogDb(dbCatalogPath);

  const queryResult = await db
    .select()
    .from(products)
    .leftJoin(makeCountries, eq(products.makeCountryId, makeCountries.id))
    .where(isNull(products.deletedAt))
    .orderBy(products.title)
    .limit(SEARCH_RECORDS_LIMIT);

  return queryResult.map((item: ProductsQueryResult) =>
    mapProductQueryResultToDomainModel(item),
  ) as SearchResult[];
}
