import { sql } from "drizzle-orm";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
export const generalVersion = table("__version", {
    id: t.int().primaryKey(),
    name: t.text().notNull(),
    createdAt: t
        .int({ mode: "timestamp" })
        .default(sql `(unixepoch())`)
        .notNull(),
});
export const info = table("info", {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t
        .text({ enum: ["catalog"] })
        .default("catalog")
        .notNull(),
    value: t.text("value").notNull(),
    createdAt: t
        .int("created_at", { mode: "timestamp" })
        .default(sql `(unixepoch())`)
        .notNull(),
    deletedAt: t.int("deleted_at", { mode: "timestamp" }),
}, (table) => [t.uniqueIndex("idx_info_name").on(table.name)]);
