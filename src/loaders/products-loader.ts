import type { LiveLoader } from 'astro/loaders';
import { parseApiError } from '../utils/error-parser';

interface Product {
  id: number;
  title: string;
  description?: string;
  unit?: string;
  quantityInPack?: number;
  price: number;
  whsPrice1: number;
  whsPrice2: number
  category: string;
  colors: Array<string>;
  image: string;
  slug: string;
}

interface CollectionFilter {
  categorySlug?: string;
}

interface EntryFilter {
  slug?: string;
}

export function createProductsLoader(
  config: {
    baseUrl: string
  }
): LiveLoader<Product, EntryFilter, CollectionFilter> {
  return {
    name: 'product-loader',
    loadCollection: async ({ filter }) => {
      try {
        const url = new URL(`${config.baseUrl}/products`);
      
        //const parentSlug = "";
        //var x = (filter as unknown) as ProductFilter;
        if (filter !== undefined/* && x !== undefined*/) {
          url.searchParams.set('category', filter.categorySlug ?? "") ;
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();

        return {
          entries: data.map((x: Product) => ({
            ...x
          })),
        };
      } catch (error: unknown) {
        return {
          error: parseApiError(error, "products"),
        }
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        const response = await fetch(`${config.baseUrl}/api/product/${filter.slug}`);
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch products: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        return data.find((x: Product) => x.slug === filter.slug);
      } catch (error: unknown) {
        return {
            error: parseApiError(error, "product"),
        }
      }
    }
  }
}
