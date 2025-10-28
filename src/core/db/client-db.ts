import Dexie, { type EntityTable } from "dexie";
import type { CategoryCache } from "../models/category";
import type { UnitOfMeasurement } from "../models/unit-of-measurement";
import type { ProductColor } from "../models/product-color";

const dbName = "Catalog";

const db = new Dexie(dbName) as Dexie & {
  categories: EntityTable<CategoryCache, "id">;
  unitOfMeasurements: EntityTable<UnitOfMeasurement, "id">;
  productColors: EntityTable<ProductColor, "id">;
};

// Schema declaration:
db.version(1).stores({
  categories: "++id, title, slug, parentSlug", // primary key "id" (for the runtime!)
  unitOfMeasurements: "++id, name, description",
  productColors: "++id, name, description",
});

export { db };
