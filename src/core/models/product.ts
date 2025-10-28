export type Product = {
  id: string;
  title: string;
  description?: string;
  unit?: string;
  quantityInPack?: number;
  price: number;
  whsPrice1: number;
  whsPrice2: number;
  categoryId: string;
  categorySlug: string;
  colors?: Array<string>;
  image: string;
  slug: string;
};
