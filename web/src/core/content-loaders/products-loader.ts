import type { LiveLoader } from "astro/loaders";
import { getErrorMessage } from "@/lib/domain";
import type {
  Product,
  PagingResult,
  Paging,
  Sorting,
  Filtering,
} from "@/lib/domain";
import {
  APIEndpointNames,
  APISearchParamNames,
  TextSeparators,
} from "../const";

type ProductCollectionFilter = {
  categorySlug: string;
  sorting: Sorting;
  paging: Paging;
  filtering: Filtering[];
};
type ProductEntryFilter = {
  slug?: string;
};

const loadProducts = async (
  baseUrl: string,
  filter: ProductCollectionFilter | undefined,
): Promise<PagingResult<Product>> => {
  const apiUrl = new URL(`${baseUrl}/${APIEndpointNames.Products}`);
  if (filter !== undefined) {
    apiUrl.searchParams.set(APISearchParamNames.Category, filter.categorySlug);
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

  const response = await fetch(apiUrl.toString());
  if (!response.ok) {
    return Promise.reject(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

function createProductsLoader(config: {
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
        const data = await loadProducts(config.baseUrl, filter);
        return {
          entries: data.items.map((x: Product) => ({ id: x.slug, data: x })),
        };
      } catch (error: unknown) {
        return {
          error: new Error(getErrorMessage(error)),
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
        const result = {
          ...data,
          createdAt: new Date(data.createdAt),
          modifiedAt: new Date(data.modifiedAt),
        } as Product;

        return result !== undefined
          ? { id: result.slug, data: result }
          : { error: new Error(`No product found for slug ${filter.slug}`) };
      } catch (error: unknown) {
        return {
          error: new Error(getErrorMessage(error)),
        };
      }
    },
  };
}

export {
  createProductsLoader,
  loadProducts,
  type ProductEntryFilter,
  type ProductCollectionFilter,
};
