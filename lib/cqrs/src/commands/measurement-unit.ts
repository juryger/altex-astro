import type { MeasurementUnit as DBMeasurementUnit } from "@/lib/dal";
import { createCatalogDb, measurementUnits } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { MeasurementUnit } from "@/lib/domain";

const mapDomainToDatabaseModel = (
  entity: MeasurementUnit,
): DBMeasurementUnit => {
  return {
    uid: entity.uid,
    code: entity.code,
    title: entity.title,
  } as DBMeasurementUnit;
};

export async function upsertMeasurementUnit(
  value: MeasurementUnit,
): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(measurementUnits)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: measurementUnits.uid,
      set: {
        code: value.code,
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: measurementUnits.id });

  return result.at(0)?.insertedId ?? 0;
}
