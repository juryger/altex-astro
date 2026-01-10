import {
  sqliteTable as table,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const units = table(
  "units",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_units_uid").on(table.uid)]
);

export const colors = table(
  "colors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_colors_uid").on(table.uid)]
);

export const countryMake = table(
  "country-make",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_country_make_uid").on(table.uid)]
);

export const discounts = table(
  "discounts",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    sum: t.real().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_discounts_uid").on(table.uid)]
);

export const categories = table(
  "categories",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    slug: t.text().notNull(),
    parentId: t
      .int("parent_id")
      .references((): AnySQLiteColumn => categories.id),
    parentSlug: t.text("parent_slug"),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_categories_uid").on(table.uid)]
);

export const products = table(
  "products",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    productCode: t.text("product_code").notNull(),
    description: t.text(),
    unit: t.int(),
    quantityInPack: t.int("quantity_in_pack").default(1).notNull(),
    minQuantityToBuy: t.int("min_quantity_to_buy").default(1).notNull(),
    price: t.numeric().notNull(),
    whsPrice1: t.numeric("whs_price1").notNull(),
    whsPrice2: t.numeric("whs_price2").notNull(),
    categoryId: t
      .numeric("category_id")
      .notNull()
      .references(() => categories.id),
    categorySlug: t.text("category_slug").notNull(),
    image: t.text().notNull(),
    slug: t.text().notNull(),
    countryMakeId: t.int("country_make_id").references(() => countryMake.id),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_products_uid").on(table.uid)]
);

export const relatedProducts = table(
  "related-products",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    productId: t.int("product_id").notNull(),
    relatedProductId: t
      .int("related_product_id")
      .notNull()
      .references(() => products.id),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_related_products_uid").on(table.uid)]
);

export const productColors = table(
  "product-colors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    productId: t
      .int("product_id")
      .notNull()
      .references(() => products.id),
    colorId: t
      .int("color_id")
      .notNull()
      .references(() => colors.id),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_product_colors_uid").on(table.uid)]
);
