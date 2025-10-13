import type { LiveLoader } from 'astro/loaders';
import { parseApiError } from '../utils/error-parser';

interface Category {
  id: number;
  title: string;
  description?: string;
  image: string;
  slug: string;
}

interface CategoryFilter {
  slug?: string;
  parentSlug?: string;
}

export function createCategoryLoader(
  config: {
    baseUrl: string
  }
): LiveLoader<Category, CategoryFilter> {
  return {
    name: 'category-loader',
    loadCollection: async ({ filter }) => {
      try {
        console.log('Categories > prepare for filter ' + JSON.stringify(filter) + ", baseUrl=" + config.baseUrl);
        const url = new URL(`${config.baseUrl}/category`);
      
        const parentSlug = "";
        var x = (filter as unknown) as CategoryFilter;
        if (filter !== undefined && x !== undefined) {
          url.searchParams.set('parent', x.parentSlug ?? "") ;
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
        console.log('Categories > API endpoint response: ' + JSON.stringify(data));

        return {
          entries: data.map((x: Category) => ({
            id: x.id,
            title: x.title,
            description: x.description,
            image: x.image,
            slug: x.slug
          })),
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
        const response = await fetch(`${config.baseUrl}/api/category/${filter.slug}`);
        if (!response.ok) {
          return {
            error: new Error(
              `Failed to fetch categories: ${response.statusText}`,
            ),
          };
        }
        const data = await response.json();
        return data.find((x: Category) => x.slug === filter.slug);
      } catch (error: unknown) {
        return {
            error: parseApiError(error, "categories"),
        }
      }
    }
  }
}
