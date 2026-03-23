import { asc, createCatalogDb, SQL, isNull, measurementUnits } from "@/lib/dal";
import { ReadReplicaTypes, type MeasurementUnit } from "@/lib/domain";
import type {
  MeasurementUnit as DbMeasurementUnit,
  SQLiteColumn,
} from "@/lib/dal";
import { ReadReplicaManager } from "../utils/read-replica-manager";

const columnTitle: SQLiteColumn = measurementUnits.title;

const getSortCondition = (): SQL => {
  return asc(columnTitle);
};

const mapQueryResultToDomainModel = (
  entity: DbMeasurementUnit,
): MeasurementUnit => {
  return <MeasurementUnit>{
    id: entity.id,
    uid: entity.uid,
    code: entity.code,
    title: entity.title,
  };
};

export async function fetchMeasurementUnits(): Promise<MeasurementUnit[]> {
  const dbCatalogPath = ReadReplicaManager.instance().getFilePath(
    ReadReplicaTypes.Catalog,
  );
  const db = createCatalogDb(dbCatalogPath);

  const queryResult = await db
    .select()
    .from(measurementUnits)
    .where(isNull(measurementUnits.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item: DbMeasurementUnit) =>
    mapQueryResultToDomainModel(item),
  );
}
