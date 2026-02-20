import { createCatalogDb } from "@/lib/dal/src";
import type { MeasurementUnit } from "@/web/src/core/models/measurement-unit";
import type { MeasurementUnit as DbMeasurementUnit } from "@/lib/dal/src/types";
import { isNull } from "@/lib/dal";
import { measurementUnits } from "@/lib/dal/src/schema/catalog";

const mapQueryResultToDomainModel = (
  entity: DbMeasurementUnit,
): MeasurementUnit => {
  return <MeasurementUnit>{
    id: entity.id,
    code: entity.code,
    title: entity.title,
  };
};

export async function fetchMeasurementUnits(): Promise<MeasurementUnit[]> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);

  const queryResult = await db
    .select()
    .from(measurementUnits)
    .where(isNull(measurementUnits.deletedAt));

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
