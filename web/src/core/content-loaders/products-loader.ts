import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../utils/endpoint-error-parser";
import type { Product } from "../models/product";
import type { Paging } from "../models/paging";
import type { Sorting } from "../models/sorting";
import type { Filtering } from "../models/filtering";
import {
  APIEndpointNames,
  APISearchParamNames,
  TextSeparators,
} from "../const";

export type ProductCollectionFilter = {
  categorySlug: string;
  sorting: Sorting;
  paging: Paging;
  filtering: Filtering[];
};

export type ProductEntryFilter = {
  slug?: string;
};

export function createProductsLoader(config: {
  baseUrl: string;
}): LiveLoader<Product, ProductEntryFilter, ProductCollectionFilter> {
  //console.log("🛠️ ~ createProductsLoader ~ config:", config);
  return {
    name: "product-loader",
    loadCollection: async ({ filter }) => {
      try {
        // console.log(
        //   "🛠️ ~ createProductsLoader ~ collection retrieving ~ filter:",
        //   filter,
        // );
        const apiUrl = new URL(
          `${config.baseUrl}/${APIEndpointNames.Products}`,
        );

        if (filter !== undefined) {
          apiUrl.searchParams.set(
            APISearchParamNames.Category,
            filter.categorySlug,
          );
          apiUrl.searchParams.set(
            APISearchParamNames.SortField,
            filter.sorting.field.toString(),
          );
          apiUrl.searchParams.set(
            APISearchParamNames.SortOrder,
            filter.sorting.order.toString(),
          );
          apiUrl.searchParams.set(
            APISearchParamNames.Page,
            filter.paging.page.toString(),
          );
          apiUrl.searchParams.set(
            APISearchParamNames.PageSize,
            filter.paging.pageSize.toString(),
          );
          filter.filtering.forEach((item) => {
            apiUrl.searchParams.set(
              APISearchParamNames.Filter,
              item.field.concat(TextSeparators.Comma, item.value),
            );
          });
        }
        // console.log(
        //   "🛠️ ~ createProductsLoader ~ fetching data via URL:",
        //   url.toString(),
        // );

        const response = await fetch(apiUrl.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        //console.log("🛠️ ~ createProductsLoader ~ collection ~ data:", data);

        return {
          entries: data.map((x: Product) => ({ id: x.slug, data: x })),
        };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "products"),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        // console.log(
        //   "🛠️ ~ createProductsLoader ~ entry retrieving ~ filter:",
        //   filter,
        // );
        const response = await fetch(
          `${config.baseUrl}/${APIEndpointNames.Products}/${filter.slug}`,
        );

        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`,
            ),
          };
        }

        const data = await response.json();
        //console.log("🛠️ ~ products-loader ~ entry:", data);
        const result = data as Product;

        return result !== undefined
          ? { id: result.slug, data: result }
          : { error: new Error(`No product found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "product"),
        };
      }
    },
  };
}
