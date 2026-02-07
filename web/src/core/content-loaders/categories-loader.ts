import type { LiveLoader } from "astro/loaders";
import { parseEndpointError } from "../utils/endpoint-error-parser";
import type { Category } from "../models/category";
import { APIEndpointNames, APISearchParamNames } from "../const";
import type { Sorting } from "../models/sorting";
import type { PageResult, Paging } from "../models/paging";

type CategoryCollectionFilter = {
  skipParentMatch: boolean;
  parentSlug?: string;
  sorting: Sorting;
  paging: Paging;
};

type CategoryEntryFilter = {
  slug?: string;
};

const loadCategories = async (
  baseUrl: string,
  filter: CategoryCollectionFilter | undefined,
): Promise<PageResult<Category>> => {
  const apiUrl = new URL(`${baseUrl}/${APIEndpointNames.Categories}`);
  if (filter !== undefined) {
    apiUrl.searchParams.set(
      APISearchParamNames.SkipParentMatch,
      filter.skipParentMatch.toString(),
    );
    if (filter.parentSlug !== undefined) {
      apiUrl.searchParams.set(APISearchParamNames.Parent, filter.parentSlug);
    }
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
  }

  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    return Promise.reject(`Failed to fetch categories: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

function createCategoriesLoader(config: {
  baseUrl: string;
}): LiveLoader<Category, CategoryEntryFilter, CategoryCollectionFilter> {
  //console.log("🛠️ ~ createCategoriesLoader ~ config:", config);
  return {
    name: "categories-loader",
    loadCollection: async ({ filter }) => {
      try {
        // console.log(
        //   "🛠️ ~ createCategoriesLoader ~ collection retrieving ~ filter:",
        //   filter,
        // );
        const data = await loadCategories(config.baseUrl, filter);
        return {
          entries: data.items.map((x: Category) => ({
            id: x.slug,
            data: x,
          })),
        };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "categories"),
        };
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        const apiUrl = new URL(
          `${config.baseUrl}/${APIEndpointNames.Categories}/${filter.slug}`,
        );

        const response = await fetch(apiUrl);
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch category: ${response.statusText}`,
            ),
          };
        }

        const data = await response.json();
        //console.log("🛠️ ~ categories-loader ~ entry:", data);
        const result = {
          ...data,
          createdAt: new Date(data.createdAt),
          modifiedAt: new Date(data.modifiedAt),
        } as Category;

        return result !== undefined
          ? { id: result.slug, data: result }
          : { error: new Error(`No category found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "category"),
        };
      }
    },
  };
}

export {
  type CategoryCollectionFilter,
  type CategoryEntryFilter,
  loadCategories,
  createCategoriesLoader,
};
