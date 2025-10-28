import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../helpers/endpoint-error-parser";
import type { Product } from "../models/product";
import type { LiveDataEntry } from "astro";

interface CollectionFilter {
  categorySlug?: string;
}

interface EntryFilter {
  slug?: string;
}

export function createProductsLoader(config: {
  baseUrl: string;
}): LiveLoader<Product, EntryFilter, CollectionFilter> {
  console.log("🚀 ~ createProductsLoader ~ baseUrl:", config.baseUrl);
  return {
    name: "product-loader",
    loadCollection: async ({ filter }) => {
      console.log("🚀 ~ createProductsLoader ~ collection ~ filter:", filter);
      try {
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
        //console.log("🚀 ~ createProductsLoader ~ collection ~ data:", data);
        return {
          entries: data.map((x: Product) => ({ ...x } as Product)),
        };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "products"),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      console.log("🚀 ~ createProductsLoader ~ entry ~ filter:", filter);
      try {
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
        //console.log("🚀 ~ createProductsLoader ~ entry ~ data:", data);
        return data as LiveDataEntry<Product>;
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "product"),
        };
      }
    },
  };
}
