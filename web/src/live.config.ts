import { defineLiveCollection } from "astro:content";
import {
  createCategoriesLoader,
  type CategoryCollectionFilter,
  type CategoryEntryFilter,
} from "./core/content-loaders/categories-loader";
import {
  createProductsLoader,
  type ProductCollectionFilter,
  type ProductEntryFilter,
} from "./core/content-loaders/products-loader";
import { type LiveLoader } from "astro/loaders";
import { CategorySchema, ProductSchema } from "@/lib/domain";
import { type Category, type Product } from "@/lib/domain";

const apiBaseUrl = `${import.meta.env.PUBLIC_API_BASE_URL}`;
console.log("🛠️ ~ live.config ~ API url:", apiBaseUrl);

const categories = defineLiveCollection<
  LiveLoader<Category, CategoryEntryFilter, CategoryCollectionFilter>,
  typeof CategorySchema
>({
  loader: createCategoriesLoader({ baseUrl: apiBaseUrl }),
  schema: CategorySchema,
});

const products = defineLiveCollection<
  LiveLoader<Product, ProductEntryFilter, ProductCollectionFilter>,
  typeof ProductSchema
>({
  loader: createProductsLoader({ baseUrl: apiBaseUrl }),
  schema: ProductSchema,
});

export const collections = { categories, products };
