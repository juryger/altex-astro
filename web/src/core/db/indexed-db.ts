import Dexie, { type EntityTable } from "dexie";
import type { CategoryCache } from "../models/category";
import type { ProductColor } from "../models/product-color";
import type { Discount } from "../models/discount";

const dbName = "Catalog";

const db = new Dexie(dbName) as Dexie & {
  categories: EntityTable<CategoryCache, "id">;
  discounts: EntityTable<Discount, "id">;
  productColors: EntityTable<ProductColor, "id">;
};

// Schema declaration:
db.version(1).stores({
  categories: "id, slug, title, parentId, parentSlug", // primary key "id" (for the runtime!)
  discounts: "id, code, title, fromSum",
  productColors: "id, code, title, fillColor, borderColor",
});

export { db as clientDb };
