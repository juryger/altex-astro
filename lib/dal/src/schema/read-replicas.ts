import type { InferSelectModel } from "drizzle-orm";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";

export const readReplicas = table(
  "read_replicas",
  {
    id: t.int().primaryKey({ autoIncrement: true }),
    name: t.text().notNull(),
    value: t.text().$type<"catalog">().default("catalog").notNull(),
  },
  (table) => [t.uniqueIndex("name_idx").on(table.name)]
);

export type ReadReplica = InferSelectModel<typeof readReplicas>;

console.log("~ read-replicas ~ init");
