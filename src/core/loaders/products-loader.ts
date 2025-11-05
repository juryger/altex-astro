import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../helpers/endpoint-error-parser";
import type { Product } from "../models/product";
import type { Pagable } from "../models/paging";
import { APIEndpointNames, APISearchParamNames } from "../const";

export type ProductCollectionFilter = {
  categorySlug: string;
  paging: Pagable;
};

export type ProductEntryFilter = {
  slug?: string;
};

export function createProductsLoader(config: {
  baseUrl: string;
}): LiveLoader<Product, ProductEntryFilter, ProductCollectionFilter> {
  console.log("🚀 ~ createProductsLoader ~ config:", config);
  return {
    name: "product-loader",
    loadCollection: async ({ filter }) => {
      try {
        console.log(
          "🚀 ~ createProductsLoader ~ collection retrieving ~ filter:",
          filter
        );

        const url = new URL(`${config.baseUrl}/${APIEndpointNames.Products}`);
        if (filter !== undefined) {
          url.searchParams.set(
            APISearchParamNames.Category,
            filter.categorySlug
          );
          url.searchParams.set(
            APISearchParamNames.Page,
            filter.paging.current.toString()
          );
          url.searchParams.set(
            APISearchParamNames.PageSize,
            filter.paging.limit.toString()
          );
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`
            ),
          };
        }
        const data = await response.json();
        console.log("🚀 ~ createProductsLoader ~ collection ~ data:", data);

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
        console.log(
          "🚀 ~ createProductsLoader ~ entry retrieving ~ filter:",
          filter
        );

        const response = await fetch(
          `${config.baseUrl}/products/${filter.slug}`
        );
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`
            ),
          };
        }

        const data = await response.json();
        const value = data as Product;
        console.log("🚀 ~ createProductsLoader ~ entry ~ value:", value);

        return value !== undefined
          ? { id: value.slug, data: value }
          : { error: new Error(`No product found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "product"),
        };
      }
    },
  };
}
