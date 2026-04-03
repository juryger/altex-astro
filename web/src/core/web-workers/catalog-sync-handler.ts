import type { PagingResult, CategoryCache, Category } from "@/lib/domain";
import { CategoriesSortFields, SortOrder } from "@/lib/domain";
import { APIEndpointNames, APISearchParamNames } from "../const";
import { clientDb } from "../db/indexed-db";

const CATEGORIES_PAGE_SIZE = 150;

type CatalogSyncHandler = {
  getReplicaDate(): Promise<Date | undefined>;
  syncCategories(): Promise<number>;
  syncDiscounts(): Promise<number>;
  syncColors(): Promise<number>;
  cleanUpCache(): Promise<void>;
};

const getCatalogSyncHandler = (config: {
  baseUrl: string;
}): CatalogSyncHandler => {
  return {
    async getReplicaDate(): Promise<Date | undefined> {
      const apiUrl = `${config.baseUrl}/${APIEndpointNames.ReplicaDate}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Replica date: ${response.status} - ${errorMessage}`,
          );
        });
      }
      var data = await response.json();
      return data !== undefined ? new Date(data) : undefined;
    },
    async syncCategories() {
      const apiUrl = `${config.baseUrl}/${APIEndpointNames.Categories}`
        .concat(`?${APISearchParamNames.SortField}=${CategoriesSortFields.Id}`)
        .concat(`&${APISearchParamNames.SortOrder}=${SortOrder.Ascending}`)
        .concat(
          `&${APISearchParamNames.Page}=0&${APISearchParamNames.PageSize}=${CATEGORIES_PAGE_SIZE}`,
        );
      const response = await fetch(apiUrl);
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Categories: ${response.status} - ${errorMessage}`,
          );
        });
      }
      var data = await response.json();
      var dataCache = (data as PagingResult<Category>).items.map(
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
      const apiUrl = new URL(`${config.baseUrl}/${APIEndpointNames.Discounts}`);
      const response = await fetch(apiUrl);
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
    async syncColors() {
      const apiUrl = new URL(`${config.baseUrl}/${APIEndpointNames.Colors}`);
      const response = await fetch(apiUrl);
      if (!response.ok) {
        response.text().then((errorMessage) => {
          throw new Error(
            `Failed to get Product colors: ${response.status} - ${errorMessage}`,
          );
        });
      }
      var data = await response.json();
      clientDb.colors.clear();
      return clientDb.colors.bulkAdd(data);
    },
    async cleanUpCache() {
      clientDb.categories.clear();
    },
  };
};

export { getCatalogSyncHandler };
