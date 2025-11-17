import Dexie, { type EntityTable } from "dexie";
import type { CategoryCache } from "../models/category";
import type { UnitOfMeasurement } from "../models/unit-of-measurement";
import type { Color } from "../models/color";

const dbName = "Catalog";

const db = new Dexie(dbName) as Dexie & {
  categories: EntityTable<CategoryCache, "id">;
  unitOfMeasurements: EntityTable<UnitOfMeasurement, "id">;
  productColors: EntityTable<Color, "id">;
};

// Schema declaration:
db.version(1).stores({
  categories: "++id, title, slug, parentId, parentSlug", // primary key "id" (for the runtime!)
  unitOfMeasurements: "++id, name",
  productColors: "++id, name",
});

export { db as clientDb };
