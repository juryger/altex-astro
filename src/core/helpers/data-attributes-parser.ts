import type { Product } from "../models/product";

const parseProduct = (dataset: DOMStringMap): Product | undefined => {
  const id = parseInt(dataset.id ?? "0", 10);
  if (isNaN(id)) {
    console.warn(
      `~ Product data attributes parser ~ value of ID is not a number:`,
      dataset.id
    );
    return undefined;
  }

  const title = dataset.title;
  if (title === undefined) {
    console.warn(
      `~ Product data attributes parser ~ value of Title is not defined`
    );
    return undefined;
  }

  const productCode = dataset.product_code;
  if (productCode === undefined) {
    console.warn(
      `~ Product data attributes parser ~ value of Product Code is not defined`
    );
    return undefined;
  }

  const colors = dataset.colors ? JSON.parse(dataset.colors) : [];

  const price: number | undefined = dataset.price
    ? parseFloat(dataset.price)
    : undefined;
  if (price === undefined || isNaN(price)) {
    console.warn(
      `~ Product data attributes parser ~ value of Price is not defined or valid:`,
      dataset.price
    );
    return undefined;
  }

  const whsPrice1: number | undefined = dataset.whs_price1
    ? parseFloat(dataset.whs_price1)
    : undefined;
  if (whsPrice1 === undefined || isNaN(whsPrice1)) {
    console.warn(
      `~ Product data attributes parser ~ value of WhsPrice1 is not defined or valid:`,
      dataset.whs_price1
    );
    return undefined;
  }

  const whsPrice2: number | undefined = dataset.whs_price2
    ? parseFloat(dataset.whs_price2)
    : undefined;
  if (whsPrice2 === undefined || isNaN(whsPrice2)) {
    console.warn(
      `~ Product data attributes parser ~ value of WhsPrice2 is not defined or valid:`,
      dataset.whs_price2
    );
    return undefined;
  }

  const image = dataset.image;
  if (image === undefined) {
    console.warn(
      `~ Product data attributes parser ~ value of Image is not defined`
    );
    return undefined;
  }

  const slug = dataset.slug;
  if (slug === undefined) {
    console.warn(
      `~ Product data attributes parser ~ value of Slug is not defined`
    );
    return undefined;
  }

  const categoryId = parseInt(dataset.category_id ?? "0", 10);
  if (isNaN(categoryId)) {
    console.warn(
      `~ Product data attributes parser ~ value of CategoryID is not a number:`,
      dataset.id
    );
    return undefined;
  }

  const categorySlug = dataset.category_slug;
  if (categorySlug === undefined) {
    console.warn(
      `~ Product data attributes parser ~ value of CategorySlug is not defined`
    );
    return undefined;
  }

  return {
    id,
    title,
    productCode,
    quantityInPack: -1,
    minQuantityToBuy: -1,
    price,
    whsPrice1,
    whsPrice2,
    categoryId,
    categorySlug,
    colors,
    image,
    slug,
  } as Product;
};

export { parseProduct };
