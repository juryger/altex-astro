import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../helpers/endpoint-error-parser";
import type { Product } from "../models/product";

export type ProductCollectionFilter = {
  categorySlug?: string;
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

        const url = new URL(`${config.baseUrl}/products`);
        if (filter !== undefined) {
          url.searchParams.set("category", filter.categorySlug ?? "");
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
          entries: data.map((x: Product) => ({ id: x.id, data: x })),
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
          ? { id: value.id, data: value }
          : { error: new Error(`No product found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "product"),
        };
      }
    },
  };
}
