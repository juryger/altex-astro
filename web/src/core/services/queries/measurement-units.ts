import { asc, createCatalogDb, SQL, isNull, measurementUnits } from "@/lib/dal";
import type { MeasurementUnit } from "@/lib/domain";
import type {
  MeasurementUnit as DbMeasurementUnit,
  SQLiteColumn,
} from "@/lib/dal";

const columnTitle: SQLiteColumn = measurementUnits.title;

const getSortCondition = (): SQL => {
  return asc(columnTitle);
};

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
    .where(isNull(measurementUnits.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
