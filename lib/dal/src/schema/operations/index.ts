import { sql } from "drizzle-orm";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const operationsVersion = table("__version", {
  id: t.int().primaryKey(),
  value: t
    .int({ mode: "timestamp" })
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const readReplicas = table(
  "read_replicas",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t
      .text({ enum: ["catalog"] })
      .default("catalog")
      .notNull(),
    fileName: t.text("file_name").notNull(),
  },
  (table) => [t.uniqueIndex("idx_read_replicas_name").on(table.name)],
);

export const guests = table(
  "guests",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t.text().notNull(),
    email: t.text().notNull(),
    phone: t.text(),
    compnayName: t.text("company_name"),
    address: t.text(),
    city: t.text(),
    postCode: t.text("post_code"),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(current_timestamp)`)
      .notNull(),
  },
  (table) => [
    t.uniqueIndex("idx_guests_name").on(table.name),
    t.uniqueIndex("idx_guests_email").on(table.email),
  ],
);

export const cart = table("cart", {
  id: t.int().primaryKey({ autoIncrement: true }),
  title: t.text().notNull(), // pre-order identifier, i.e. ONLINE-{ID} or STORE-{ID}
  userId: t.int("user_id"), //.reference(() => users.id), <- cannot reference external db-file, not supported by SQLite
  guestId: t.int("guest_id").references(() => guests.id),
  discountId: t.int("discount_id"), //.references(() => discounts.id), <- cannot reference external db-file, not supported by SQLite
  createdAt: t
    .int("created_at", { mode: "timestamp" })
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const cartItems = table("cart_items", {
  id: t.int().primaryKey({ autoIncrement: true }),
  cartId: t
    .int("cart_id")
    .notNull()
    .references(() => cart.id),
  productId: t.int("product_id").notNull(), // .references(() => products.id), <- cannot reference external db-file, not supported by SQLite
  colorId: t.int("color_id"),
  quantity: t.int().notNull(),
});

export const notifications = table("notifications", {
  id: t.int().primaryKey({ autoIncrement: true }),
  message: t
    .text({ mode: "json" }) //.$type<{ foo: T }>()
    .notNull(),
  createdAt: t
    .int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const notificationAddressees = table("notification_addresses", {
  id: t.int().primaryKey({ autoIncrement: true }),
  notificationId: t
    .int("notification_id")
    .notNull()
    .references(() => notifications.id),
  type: t
    .text({ enum: ["email", "inapp", "sms"] })
    .default("email")
    .notNull(),
  guestId: t.int("guest_id"),
  userId: t.int("user_id"),
});
