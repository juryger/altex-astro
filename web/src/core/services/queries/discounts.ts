import { createCatalogDb } from "@/lib/dal/src";
import type { Discount } from "@/web/src/core/models/discount";

export function getDiscountsList(): Promise<Discount[]> {
  const db = createCatalogDb(process.env.DB_CATALOG_PATH);
  return db.query.discounts.findMany();
}
