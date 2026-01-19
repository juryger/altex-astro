import { sql } from "drizzle-orm";
import {
  sqliteTable as table,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const catalogVersion = table("__version", {
  id: t.int().primaryKey(),
  value: t
    .int({ mode: "timestamp" })
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const measurementUnits = table(
  "measurement_units",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_units_uid").on(table.uid)],
);

export const colors = table(
  "colors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_colors_uid").on(table.uid)],
);

export const makers = table(
  "makers",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_makers_uid").on(table.uid)],
);

export const makeCountries = table(
  "make_countries",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_make_countries_uid").on(table.uid)],
);

export const discounts = table(
  "discounts",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    fromSum: t.real().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_discounts_uid").on(table.uid)],
);

export const categories = table(
  "categories",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    parentId: t
      .int("parent_id")
      .references((): AnySQLiteColumn => categories.id),
    slug: t.text().notNull(),
    title: t.text().notNull(),
    description: t.text(),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(current_timestamp)`)
      .notNull(),
    modifiedAt: t
      .int("modified_at", { mode: "timestamp" })
      .default(sql`(current_timestamp)`)
      .notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_categories_uid").on(table.uid)],
);

export const products = table(
  "products",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    productCode: t.text("product_code").notNull(),
    slug: t.text().notNull(),
    categoryId: t
      .numeric("category_id")
      .notNull()
      .references(() => categories.id),
    title: t.text().notNull(),
    description: t.text(),
    unitId: t
      .int("unit_id")
      .references(() => measurementUnits.id)
      .notNull(),
    dimensionLengthMm: t.int("dimension_length_mm"),
    dimensionWidthMm: t.int("dimension_width_mm"),
    dimensionHeightMm: t.int("dimension_height_mm"),
    weightGr: t.int("weight_gr"),
    quantityInPack: t.int("quantity_in_pack").default(1).notNull(),
    minQuantityToBuy: t.int("min_quantity_to_buy").default(1).notNull(),
    price: t.numeric().notNull(),
    whsPrice1: t.numeric("whs_price1").notNull(),
    whsPrice2: t.numeric("whs_price2").notNull(),
    makerId: t.int("maker_id").references(() => makers.id),
    makeCountryId: t.int("make_country_id").references(() => makeCountries.id),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(current_timestamp)`)
      .notNull(),
    modifiedAt: t
      .int("modified_at", { mode: "timestamp" })
      .default(sql`(current_timestamp)`)
      .notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_products_uid").on(table.uid)],
);

export const relatedProducts = table(
  "related_products",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    productId: t.int("product_id").notNull(),
    relatedProductId: t
      .int("related_product_id")
      .notNull()
      .references(() => products.id),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_related_products_uid").on(table.uid)],
);

export const productColors = table(
  "product_colors",
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
  (table) => [t.uniqueIndex("idx_product_colors_uid").on(table.uid)],
);
