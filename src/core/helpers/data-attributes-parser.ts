import type { CartItem } from "../models/cart";
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

  return {
    id,
    title,
    productCode: "",
    quantityInPack: -1,
    minQuantityToBuy: -1,
    price,
    whsPrice1,
    whsPrice2,
    categoryId: -1,
    categorySlug: "",
    colors,
    image,
    slug,
  } as Product;
};

const parseCartItem = (dataset: DOMStringMap): CartItem | undefined => {
  const id = dataset.id;
  if (!id) {
    console.warn(
      `~ CartItem data attributes parser ~ value of ID is not defined.`
    );
    return undefined;
  }

  const productId = parseInt(dataset.product_id ?? "0", 10);
  if (isNaN(productId)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of product ID is not a number:`,
      dataset.product_id
    );
    return undefined;
  }

  const title = dataset.title;
  if (title === undefined) {
    console.warn(
      `~ CartItem data attributes parser ~ value of Title is not defined.`
    );
    return undefined;
  }

  const availableColors = dataset.availableColors
    ? JSON.parse(dataset.availableColors)
    : [];

  const price: number | undefined = dataset.price
    ? parseFloat(dataset.price)
    : undefined;
  if (price === undefined || isNaN(price)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of Price is not defined or valid:`,
      dataset.price
    );
    return undefined;
  }

  const whsPrice1: number | undefined = dataset.whs_price1
    ? parseFloat(dataset.whs_price1)
    : undefined;
  if (whsPrice1 === undefined || isNaN(whsPrice1)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of WhsPrice1 is not defined or valid:`,
      dataset.whs_price1
    );
    return undefined;
  }

  const whsPrice2: number | undefined = dataset.whs_price2
    ? parseFloat(dataset.whs_price2)
    : undefined;
  if (whsPrice2 === undefined || isNaN(whsPrice2)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of WhsPrice2 is not defined or valid:`,
      dataset.whs_price2
    );
    return undefined;
  }

  const image = dataset.image;
  if (image === undefined) {
    console.warn(
      `~ CartItem data attributes parser ~ value of Image is not defined`
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

  const quantity: number | undefined = dataset.quantity
    ? parseInt(dataset.quantity, 10)
    : undefined;
  if (quantity === undefined || isNaN(quantity)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of Quantity is not defined or valid:`,
      dataset.quantity
    );
    return undefined;
  }

  const color: number | undefined = dataset.color
    ? parseInt(dataset.color, 10)
    : undefined;
  if (color === undefined || isNaN(color)) {
    console.warn(
      `~ CartItem data attributes parser ~ value of Color is not defined or valid:`,
      dataset.quantity
    );
    return undefined;
  }

  return {
    id,
    productId,
    title,
    availableColors,
    price,
    whsPrice1,
    whsPrice2,
    image,
    slug,
    color,
    quantity,
  } as CartItem;
};

export { parseProduct, parseCartItem };
