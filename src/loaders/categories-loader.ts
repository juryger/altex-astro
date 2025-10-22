import type { LiveLoader } from 'astro/loaders';
import { parseEndpointError } from '../utils/endpoint-error-parser';

export type Category = {
  id: string;
  title: string;
  description?: string;
  image: string;
  slug: string;
  parentId?: number;
  parentSlug?: string;
}

interface CollectionFilter {
  parentSlug?: string;
}

interface EntryFilter {
  slug?: string;
}

export function createCategoriesLoader(
  config: {
    baseUrl: string
  }
): LiveLoader<Category, EntryFilter, CollectionFilter> {
  console.log("🚀 ~ createCategoriesLoader ~ baseUrl:", config.baseUrl)
  
  return {
    name: 'categories-loader',
    loadCollection: async ({ filter }) => {
      try {
        //console.log("🚀 ~ createCategoriesLoader ~ collection ~ filter:", filter);
        const url = new URL(`${config.baseUrl}/categories`);
      
        if (filter !== undefined) {
          url.searchParams.set('parent', filter.parentSlug ?? "");
        } 
        
        //console.log("🚀 ~ createCategoriesLoader ~ collection ~ url:", url.toString());
        const response = await fetch(url.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch categories: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        //console.log("🚀 ~ createCategoriesLoader ~ collection ~ data:", data);
        return {
          entries: data.map((x: Category) => ({
            ...x
          })) 
        };
      } catch (error: unknown) {
        return {
          error: parseEndpointError(error, "categories"),
        }
      }
    },
    loadEntry: async ({ filter }) => {
      //console.log("🚀 ~ createCategoriesLoader ~ entry ~ filter:", filter);
      try {
        const response = await fetch(`${config.baseUrl}/categories/${filter.slug}`);
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch category: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        //console.log("🚀 ~ createCategoriesLoader ~ entry ~ data:", data);
        return data;
      } catch (error: unknown) {
        return {
            error: parseEndpointError(error, "category"),
        }
      }
    }
  }
}
