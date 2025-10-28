import { db } from "../db/client-db";
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
  console.log("🚀 ~ catalog-sync-handler ~ config: ", config);
  return {
    async syncCategories() {
      const url = new URL(`${config.apiBaseUrl}/categories`);
      await fetch(url).then();

      const response = await fetch(url);
      if (!response.ok) {
        response.text().then((errorMessage) => {
          console.error(
            "🚀 ~ catalog-sync-handler ~ failed to get categories: %s - %s",
            response.status,
            errorMessage
          );
          throw new Error(
            `Failed to get categories: ${response.status} - ${errorMessage}`
          );
        });
      }

      var data = await response.json();
      console.log(
        "🚀 ~ catalog-sync-handler ~ obtained categories data: ",
        data
      );

      var dataCache = (data as Array<Category>).map(
        (x) =>
          ({
            id: x.id,
            title: x.title,
            slug: x.slug,
            parentSlug: x.parentSlug,
          } as CategoryCache)
      );

      return db.categories.bulkAdd(dataCache).then((value) => {
        console.log(
          "🚀 ~ catalog-sync-handler ~ Categories has been saved to IndexedDb:",
          value
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
      db.categories.clear();
      return;
    },
  };
};
