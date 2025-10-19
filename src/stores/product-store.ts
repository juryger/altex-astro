import { atom } from 'nanostores'
import type { Product } from '../loaders/products-loader';

export const currentProduct = atom<Product | undefined>();

export function assignCurrentProduct(value: Product | undefined) {
  if (value) currentProduct.set({...value});
  else currentProduct.set(undefined);
}