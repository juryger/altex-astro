import type { PageResult } from "@/lib/domain/src";
import {
  APIEndpointNames,
  APISearchParamNames,
  SortFields,
  SortOrder,
} from "../const";
import { clientDb } from "../db/indexed-db";
import type { CategoryCache, Category } from "../models/category";

const CATEGORIES_PAGE_SIZE = 150;

type CatalogSyncHandler = {
  syncCategories(): Promise<number>;
  syncDiscounts(): Promise<number>;
  syncProductColors(): Promise<number>;
  cleanUpCache(): Promise<void>;
};

const getCatalogSyncHandler = (config: {
  baseUrl: string;
}): CatalogSyncHandler => {
  //console.log("🛠️ ~ catalog-sync-handler ~ config: ", config);
  return {
    async syncCategories() {
      const response = await fetch(
        new URL(
          `${config.baseUrl}/${APIEndpointNames.Categories}?${APISearchParamNames.SortField}=${SortFields.Id}&${APISearchParamNames.SortOrder}=${SortOrder.Ascending}&${APISearchParamNames.Page}=0&${APISearchParamNames.PageSize}=${CATEGORIES_PAGE_SIZE}`,
        ),
      );
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Categories: ${response.status} - ${errorMessage}`,
          );
        });
      }

      var data = await response.json();
      var dataCache = (data as PageResult<Category>).items.map(
        (x) =>
          ({
            id: x.id,
            title: x.title,
            slug: x.slug,
            parentId: x.parentId,
            parentSlug: x.parentSlug,
          }) as CategoryCache,
      );

      clientDb.categories.clear();
      return clientDb.categories.bulkAdd(dataCache);
    },
    async syncDiscounts() {
      const response = await fetch(
        new URL(`${config.baseUrl}/${APIEndpointNames.Discounts}`),
      );
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Discounts: ${response.status} - ${errorMessage}`,
          );
        });
      }
      var data = await response.json();
      clientDb.discounts.clear();
      return clientDb.discounts.bulkAdd(data);
    },
    async syncProductColors() {
      const response = await fetch(
        new URL(`${config.baseUrl}/${APIEndpointNames.ProductColors}`),
      );
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Product colors: ${response.status} - ${errorMessage}`,
          );
        });
      }
      var data = await response.json();
      clientDb.productColors.clear();
      return clientDb.productColors.bulkAdd(data);
    },
    async cleanUpCache() {
      clientDb.categories.clear();
    },
  };
};

export { getCatalogSyncHandler };
