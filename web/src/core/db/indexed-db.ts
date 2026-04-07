import Dexie, { type EntityTable } from "dexie";
import type { CategoryCache } from "@/lib/domain";
import type { Color, Discount } from "@/lib/domain";

const dbName = "Catalog";

const db = new Dexie(dbName) as Dexie & {
  categories: EntityTable<CategoryCache, "id">;
  discounts: EntityTable<Discount, "id">;
  colors: EntityTable<Color, "id">;
};

// Schema declaration:
db.version(2).stores({
  categories: "id, slug, title, parentId, parentSlug", // primary key "id" (for the runtime!)
  discounts: "id, code, title, fromSum",
  colors: "id, code, title, fillColor, borderColor, uid",
});

export { db as clientDb };
