import { getLiveEntry, getLiveCollection } from "astro:content";
import { LiveCollectionNames as CollectionNames } from "../const";
import type { LiveCollectionNames } from "../const";
import type { CategoryCollectionFilter } from "../content-loaders/categories-loader";
import type { ProductCollectionFilter } from "../content-loaders/products-loader";
import type { Product, Category } from "@/lib/domain";

const getEntryBySlug = async <T>(
  collection: LiveCollectionNames,
  slug: string,
): Promise<{ slug: string; value: T | undefined }> => {
  const result = await getLiveEntry(collection, { slug: slug });
  if (result.error) {
    throw new Error(
      `Failed to retrieve item with id: ${slug}. ${result.error.message}`,
    );
  }
  return { slug, value: result.entry?.data as T };
};

const getCollectionByFilter = async <T>(
  collection: LiveCollectionNames,
  filter: ProductCollectionFilter | CategoryCollectionFilter,
): Promise<{ value: T[] | undefined }> => {
  const result = await getLiveCollection(collection, filter);
  if (result?.error) {
    throw new Error(
      `Failed to retrieve collection '${collection}' with filter: ${JSON.stringify(
        filter,
      )}. ${result.error.message}`,
    );
  }
  return { value: result.entries?.map((x) => x.data as T) };
};

const getCategoriesList = async (
  filter: CategoryCollectionFilter,
): Promise<Category[] | undefined> => {
  console.log("⚡️ ~ live-collection-manager ~ getCategoriesList", filter);
  const result = await getCollectionByFilter<Category>(
    CollectionNames.Categories,
    filter,
  );
  return result.value;
};

const getCategory = async (slug: string): Promise<Category | undefined> => {
  console.log("⚡️ ~ live-collection-manager ~ getCategory", slug);
  const result = await getEntryBySlug<Category>(
    CollectionNames.Categories,
    slug,
  );
  return result.value;
};

const getProductsList = async (
  filter: ProductCollectionFilter,
): Promise<Product[] | undefined> => {
  console.log("⚡️ ~ live-collection-manager ~ getProductsList", filter);
  const result = await getCollectionByFilter<Product>(
    CollectionNames.Products,
    filter,
  );
  return result.value;
};

const getProduct = async (slug: string): Promise<Product | undefined> => {
  console.log("⚡️ ~ live-collection-manager ~ getProduct", slug);
  const result = await getEntryBySlug<Product>(CollectionNames.Products, slug);
  return result.value;
};

export { getProduct, getCategory, getCategoriesList, getProductsList };
