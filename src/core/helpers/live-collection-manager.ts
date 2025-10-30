import { getLiveEntry, getLiveCollection } from "astro:content";
import type { LiveCollectionNames } from "../const";

const getEntryBySlug = async <T>(
  collection: LiveCollectionNames,
  slug: string
): Promise<{ slug: string; value: T | undefined }> => {
  return getLiveEntry(collection, { slug: slug }).then((result) => {
    if (result.error)
      throw new Error(
        `Failed to retrieve item with id: ${slug}. ${result.error.message}`
      );
    return { slug, value: result.entry?.data as T };
  });
};

const getCollectionByParentSlug = async <T>(
  collection: LiveCollectionNames,
  parentSlug?: string
): Promise<{ parentSlug?: string; value: T[] | undefined }> => {
  return getLiveCollection(collection, { parentSlug: parentSlug ?? "" }).then(
    (result) => {
      if (result.error)
        throw new Error(
          `Failed to retrieve collection '${collection}' with parent filter: ${parentSlug}. ${result.error.message}`
        );
      return { parentSlug, value: result.entries as T[] };
    }
  );
};

export { getEntryBySlug, getCollectionByParentSlug };
