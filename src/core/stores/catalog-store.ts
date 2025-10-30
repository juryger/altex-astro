import { atom } from "nanostores";
import type { Product } from "../models/product";
import type { Category } from "../models/category";

export const $activeProduct = atom<Product | undefined>();
export const $activeCategory = atom<Category | undefined>();

export function setActiveProduct(value: Product | undefined) {
  if (value) $activeProduct.set({ ...value });
  else $activeProduct.set(undefined);
}

export function setActiveCategory(value: Category | undefined) {
  if (value) $activeCategory.set({ ...value });
  else $activeCategory.set(undefined);
}
