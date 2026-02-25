import { sql } from "drizzle-orm";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const operationsVersion = table("__version", {
  id: t.int().primaryKey(),
  name: t.text().notNull(),
  createdAt: t
    .int({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
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
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    isFailed: t.int("is_failed").default(0),
    syncLog: t.text("sync_log"),
  },
  (table) => [t.uniqueIndex("idx_read_replicas_name").on(table.name)],
);

export const guests = table(
  "guests",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    fullName: t.text("full_name").notNull(),
    email: t.text().notNull(),
    phone: t.text(),
    compnayName: t.text("company_name"),
    address: t.text(),
    city: t.text(),
    postCode: t.text("post_code"),
    taxNumber: t.text("tax_number"),
    createdAt: t
      .int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    uid: t.text().notNull(),
  },
  (table) => [t.uniqueIndex("idx_guests_email").on(table.email)],
);

export const cartCheckout = table("cart_checkout", {
  id: t.int().primaryKey({ autoIncrement: true }),
  userUid: t.text("user_uid"), //.reference(() => users.id), <- cannot reference external db-file, not supported by SQLite
  guestUid: t.text("guest_uid"), //.references(() => guests.id),
  createdAt: t
    .int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const cartCheckoutItems = table("cart_checkout_items", {
  id: t.int().primaryKey({ autoIncrement: true }),
  cartCheckoutId: t
    .int("cart_checkout_id")
    .notNull()
    .references(() => cartCheckout.id),
  productUid: t.text("product_uid").notNull(), // .references(() => products.id), <- cannot reference external db-file, not supported by SQLite
  colorUid: t.text("color_uid"),
  quantity: t.int().notNull(),
  price: t.real().notNull(),
});

export const notifications = table("notifications", {
  id: t.int().primaryKey({ autoIncrement: true }),
  message: t
    .text({ mode: "json" }) //.$type<{ foo: T }>()
    .notNull(),
  createdAt: t
    .int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
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
