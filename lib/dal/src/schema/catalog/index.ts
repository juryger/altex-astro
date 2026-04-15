import { SQL, sql } from "drizzle-orm";
import {
  sqliteTable as table,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const catalogVersion = table(
  "__version",
  {
    id: t.int().primaryKey(),
    name: t.text().notNull(),
    createdAt: t
      .int({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (table) => [t.uniqueIndex("idx_name").on(table.name)],
);

export const measurementUnits = table(
  "measurement_units",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [t.uniqueIndex("idx_units_uid").on(table.uid)],
);

export const colors = table(
  "colors",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t.text().notNull(),
    title: t.text().notNull(),
    fillColor: t.text("fill_color").notNull(),
    borderColor: t.text("border_color").notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [t.uniqueIndex("idx_colors_uid").on(table.uid)],
);

export const makers = table(
  "makers",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    title: t.text().notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
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
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [t.uniqueIndex("idx_make_countries_uid").on(table.uid)],
);

export const discounts = table(
  "discounts",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    fromSum: t.real().notNull(),
    title: t.text().notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
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
    hasImage: t.int("has_image").default(0),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    modifiedAt: t
      .int("modified_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [
    t.uniqueIndex("idx_categories_uid").on(table.uid),
    t.index("idx_categories_title").on(table.title),
    t
      .index("idx_categories_parent_id_slug_deleted_at")
      .on(table.parentId, table.slug, table.deletedAt),
  ],
);

export const products = table(
  "products",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    code: t
      .text()
      .generatedAlwaysAs(
        (): SQL =>
          sql`SUBSTRING(${products.slug}, 1, IIF(LENGTH(${products.slug}) >= 4, 4, LENGTH(${products.slug}))) || '-' || ${products.id}`,
      ),
    slug: t.text().notNull(),
    categoryId: t
      .int("category_id")
      .notNull()
      .references(() => categories.id),
    title: t.text().notNull(),
    description: t.text(),
    hasImage: t.int("has_image").default(0),
    unitId: t.int("unit_id").references(() => measurementUnits.id),
    dimensionLengthMm: t.real("dimension_length_mm"),
    dimensionWidthMm: t.real("dimension_width_mm"),
    dimensionHeightMm: t.real("dimension_height_mm"),
    dimensionDiameterMm: t.real("dimension_diameter_mm"),
    weightGr: t.real("weight_gr"),
    quantityInPack: t.int("quantity_in_pack").default(1).notNull(),
    minQuantityToBuy: t.int("min_quantity_to_buy").default(1).notNull(),
    price: t.real().notNull(),
    whsPrice1: t.real("whs_price1").notNull(),
    whsPrice2: t.real("whs_price2").notNull(),
    makerId: t.int("maker_id").references(() => makers.id),
    makeCountryId: t.int("make_country_id").references(() => makeCountries.id),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    modifiedAt: t
      .int("modified_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    uid: t.text().notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [
    t.uniqueIndex("idx_products_uid").on(table.uid),
    t.index("idx_products_title").on(table.title),
    t.index("idx_products_price").on(table.price),
    t.index("idx_products_category_id").on(table.categoryId),
    t
      .index("idx_products_category_id_slug_deleted_at")
      .on(table.categoryId, table.slug, table.deletedAt),
    t.index("idx_products_category_id_title").on(table.categoryId, table.title),
    t.index("idx_products_category_id_price").on(table.categoryId, table.price),
  ],
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
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
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
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
  },
  (table) => [t.uniqueIndex("idx_product_colors_uid").on(table.uid)],
);
