import type { LiveLoader } from 'astro/loaders';
import { parseApiError } from '../utils/error-parser';

export type Category = {
  id: string;
  //title: string;
  //description?: string;
  //image: string;
  slug: string;
  //parent?: string;
}

export type CollectionFilter = {
  parentSlug?: string;
}

type EntryFilter ={
  slug?: string;
}

export function createCategoriesLoader(
  config: {
    baseUrl: string
  }
): LiveLoader<Category, EntryFilter, CollectionFilter> {
  return {
    name: 'categories-loader',
    loadCollection: async ({ filter }) => {
      try {
        console.log('Categories > prepare for filter ' + JSON.stringify(filter) + ", baseUrl=" + config.baseUrl);
        const url = new URL(`${config.baseUrl}/categories`);
      
        //const parentSlug = "";
        //var x = (filter as unknown) as CategoryFilter;
        if (filter !== undefined /*&& x !== undefined*/) {
          url.searchParams.set('parent', filter.parentSlug ?? "") ;
        }

        console.log('Categories > fetch from ' + url.toString());
        const response = await fetch(url.toString());
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch categories: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        console.log('Categories > API endpoint response for All: ' + JSON.stringify(data));
        
        return {
          entries: data.map((x: Category) => ({
            ...x
          })) 
        };
      } catch (error: unknown) {
        return {
          error: parseApiError(error, "categories"),
        }
      }
    },
    loadEntry: async ({ filter }) => {
      console.log('Category > prepare for filter ' + JSON.stringify(filter) + ", baseUrl=" + config.baseUrl);
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
        console.log("🚀 ~ createCategoriesLoader ~ data:", data);
        
        return data;
      } catch (error: unknown) {
        return {
            error: parseApiError(error, "category"),
        }
      }
    }
  }
}
