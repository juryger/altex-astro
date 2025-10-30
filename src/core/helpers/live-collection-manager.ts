import { getLiveEntry, getLiveCollection } from "astro:content";
import type { LiveCollectionNames } from "../const";
import type { CategoryCollectionFilter } from "../loaders/categories-loader";

const getEntryBySlug = async <T>(
  collection: LiveCollectionNames,
  slug: string
): Promise<{ slug: string; value: T | undefined }> => {
  return getLiveEntry(collection, { slug: slug }).then((result) => {
    if (result.error) {
      throw new Error(
        `Failed to retrieve item with id: ${slug}. ${result.error.message}`
      );
    }
    return { slug, value: result.entry?.data as T };
  });
};

const getCollectionByFilter = async <T>(
  collection: LiveCollectionNames,
  filter: any
): Promise<{ value: T[] | undefined }> => {
  return getLiveCollection(collection, filter as CategoryCollectionFilter).then(
    (result) => {
      if (result.error)
        throw new Error(
          `Failed to retrieve collection '${collection}' with filter: ${JSON.stringify(
            filter
          )}. ${result.error.message}`
        );
      return { value: result.entries as T[] };
    }
  );
};

export { getEntryBySlug, getCollectionByFilter };
