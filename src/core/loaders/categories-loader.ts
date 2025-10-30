import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../helpers/endpoint-error-parser";
import type { Category } from "../models/category";

export type CategoryCollectionFilter = {
  parentSlug?: string;
};

export type CategoryEntryFilter = {
  slug?: string;
};

export function createCategoriesLoader(config: {
  baseUrl: string;
}): LiveLoader<Category, CategoryEntryFilter, CategoryCollectionFilter> {
  console.log("🚀 ~ createCategoriesLoader ~ config:", config);
  return {
    name: "categories-loader",
    loadCollection: async ({ filter }) => {
      try {
        console.log(
          "🚀 ~ createCategoriesLoader ~ collection retrieving ~ filter:",
          filter
        );

        const url = new URL(`${config.baseUrl}/categories`);
        if (filter !== undefined) {
          url.searchParams.set("parent", filter.parentSlug ?? "");
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch categories: ${response.statusText}`
            ),
          };
        }
        const data = await response.json();
        console.log("🚀 ~ createCategoriesLoader ~ collection ~ data:", data);

        return {
          entries: data.map((x: Category) => ({ id: x.uid, data: x })),
        };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "categories"),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        console.log(
          "🚀 ~ createCategoriesLoader ~ entry retrieving ~ filter:",
          filter
        );

        const response = await fetch(
          `${config.baseUrl}/categories/${filter.slug}`
        );
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch category: ${response.statusText}`
            ),
          };
        }

        const data = await response.json();
        const value = data as Category;
        console.log("🚀 ~ createCategoriesLoader ~ entry ~ value:", value);

        return value !== undefined
          ? { id: value.uid, data: value }
          : { error: new Error(`No category found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "category"),
        };
      }
    },
  };
}
