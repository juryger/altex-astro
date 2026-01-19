import { createCatalogDb } from "@/lib/dal/src";
import type { UnitOfMeasurement } from "@/web/src/core/models/unit-of-measurement";

export function getMeasurementUnitsList(): Promise<UnitOfMeasurement[]> {
  const db = createCatalogDb(process.env.DB_CATALOG_PATH);
  const measurementUnits = db.query.measurementUnits.findMany();
  return measurementUnits;
}
