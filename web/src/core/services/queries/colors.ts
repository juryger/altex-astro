import { createCatalogDb } from "@/lib/dal/src";
import type { Color } from "@/web/src/core/models/color";

export function getColorsList(): Promise<Color[]> {
  const db = createCatalogDb(process.env.DB_CATALOG_PATH);
  return db.query.colors.findMany();
}
