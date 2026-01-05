import {
  sqliteTable as table,
  type AnySQLiteColumn,
} from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm/table";

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
  (table) => [t.uniqueIndex("uid_idx").on(table.uid)]
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
    colors: t.text(),
    image: t.text().notNull(),
    slug: t.text().notNull(),
    parentId: t.int("parent_id"),
    parentSlug: t.text("parent_slug"),
    relatedProducts: t.text("related_products"),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("uid_idx").on(table.uid)]
);

export type Category = InferSelectModel<typeof categories>;
