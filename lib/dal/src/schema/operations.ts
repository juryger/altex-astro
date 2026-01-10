import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const replicas = table(
  "replicas",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t
      .text({ enum: ["catalog"] })
      .notNull()
      .default("catalog"),
    fileName: t.text("file_name").notNull(),
  },
  (table) => [t.uniqueIndex("idx_replicas_name").on(table.name)]
);

export const guests = table(
  "guests",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t.text().notNull(),
    email: t.text().notNull(),
    contatctPhone: t.text("contact_phone").notNull(),
    deliveryAddress: t.text("delivery_address").notNull(),
  },
  (table) => [
    t.uniqueIndex("idx_guests_name").on(table.name),
    t.uniqueIndex("idx_guests_email").on(table.email),
  ]
);

export const cart = table("cart", {
  id: t.int().primaryKey({ autoIncrement: true }),
  userId: t.int("user_id"), //.reference(() => users.id), <- cannot reference external db-file, not supported by SQLite
  guestId: t.int("guest_id").references(() => guests.id),
  discountId: t.int("discount_id"), //.references(() => discounts.id), <- cannot reference external db-file, not supported by SQLite
  createdAt: t
    .int("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const cartItems = table("cart-items", {
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
    .$defaultFn(() => new Date()),
});

export const notificationAdressees = table("notification-addresses", {
  id: t.int().primaryKey({ autoIncrement: true }),
  notificationId: t
    .int("notification_id")
    .notNull()
    .references(() => notifications.id),
  type: t
    .text({ enum: ["email", "in-app", "sms"] })
    .notNull()
    .default("email"),
  guestId: t.int("guest_id"),
  userId: t.int("user_id"),
});
