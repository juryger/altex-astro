import { getLiveEntry, getLiveCollection } from "astro:content";
import { LiveCollectionNames as CollectionNames } from "../const";
import type { LiveCollectionNames } from "../const";
import type { CategoryCollectionFilter } from "../loaders/categories-loader";
import type { ProductCollectionFilter } from "../loaders/products-loader";
import type { Category } from "../models/category";
import type { Product } from "../models/product";

const getEntryBySlug = async <T>(
  collection: LiveCollectionNames,
  slug: string
): Promise<{ slug: string; value: T | undefined }> => {
  const result = await getLiveEntry(collection, { slug: slug });
  if (result.error) {
    throw new Error(
      `Failed to retrieve item with id: ${slug}. ${result.error.message}`
    );
  }
  return { slug, value: result.entry?.data as T };
};

const getCollectionByFilter = async <T>(
  collection: LiveCollectionNames,
  filter: ProductCollectionFilter | CategoryCollectionFilter
): Promise<{ value: T[] | undefined }> => {
  const result = await getLiveCollection(collection, filter);
  if (result.error) {
    throw new Error(
      `Failed to retrieve collection '${collection}' with filter: ${JSON.stringify(
        filter
      )}. ${result.error.message}`
    );
  }
  return { value: result.entries?.map((x) => x.data as T) };
};

const getProduct = async (slug: string): Promise<Product | undefined> => {
  const result = await getEntryBySlug<Product>(CollectionNames.Products, slug);
  return result.value;
};

const getProductsList = async (
  filter: ProductCollectionFilter
): Promise<Product[] | undefined> => {
  const result = await getCollectionByFilter<Product>(
    CollectionNames.Products,
    filter
  );
  return result.value;
};

const getCategory = async (slug: string): Promise<Category | undefined> => {
  const result = await getEntryBySlug<Category>(
    CollectionNames.Categories,
    slug
  );
  return result.value;
};

const getCategoriesList = async (
  filter: CategoryCollectionFilter
): Promise<Category[] | undefined> => {
  const result = await getCollectionByFilter<Category>(
    CollectionNames.Categories,
    filter
  );
  return result.value;
};

export { getProduct, getCategory, getCategoriesList, getProductsList };
