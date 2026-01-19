import { APIEndpointNames, APISearchParamNames } from "../const";
import { clientDb } from "../db/indexed-db";
import type { CategoryCache, Category } from "../models/category";

type CatalogSyncHandler = {
  syncCategories(): Promise<void>;
  syncUnitOfMeasurements(): Promise<void>;
  syncProductColors(): Promise<void>;
  cleanUpCache(): Promise<void>;
};

export const getCatalogSyncHandler = (config: {
  apiBaseUrl: string;
}): CatalogSyncHandler => {
  console.log("🛠️ ~ catalog-sync-handler ~ config: ", config);
  return {
    async syncCategories() {
      // try to get all categories for caching (skip filters and up to 1000 entities)
      const url = new URL(
        `${config.apiBaseUrl}/${APIEndpointNames.Categories}?&${APISearchParamNames.SkipParentMatch}=true&${APISearchParamNames.Page}=0&${APISearchParamNames.PageSize}=1000`,
      );
      const response = await fetch(url);
      if (!response.ok) {
        response.text().then((errorMessage) => {
          console.error(
            "🛠️ ~ catalog-sync-handler ~ failed to get categories: %s - %s",
            response.status,
            errorMessage,
          );
          throw new Error(
            `Failed to get categories: ${response.status} - ${errorMessage}`,
          );
        });
      }

      var data = await response.json();
      console.log(
        "🛠️ ~ catalog-sync-handler ~ obtained categories data: ",
        data,
      );

      var dataCache = (data as Array<Category>).map(
        (x) =>
          ({
            id: x.id,
            title: x.title,
            slug: x.slug,
            parentId: x.parentId,
            parentSlug: x.parentSlug,
          }) as CategoryCache,
      );

      return clientDb.categories.bulkAdd(dataCache).then((value) => {
        console.log(
          "🛠️ ~ catalog-sync-handler ~ Categories has been saved to IndexedDb:",
          value,
        );
      });
    },
    async syncUnitOfMeasurements() {
      // TODO: save unitOfMeasurement to IndexDB
      return;
    },
    async syncProductColors() {
      // TODO: save productColors to IndexDB
      return;
    },
    async cleanUpCache() {
      clientDb.categories.clear();
      return;
    },
  };
};
