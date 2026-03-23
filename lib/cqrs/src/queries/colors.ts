import { asc, createCatalogDb, SQL, colors, isNull } from "@/lib/dal";
import type { Color as DbColor, SQLiteColumn } from "@/lib/dal";
import { ReadReplicaTypes, type Color } from "@/lib/domain";
import { ReadReplicaManager } from "../utils/read-replica-manager";

const columnTitle: SQLiteColumn = colors.title;

const getSortCondition = (): SQL => {
  return asc(columnTitle);
};

const mapQueryResultToDomainModel = (entity: DbColor): Color => {
  return {
    id: entity.id,
    code: entity.code,
    title: entity.title,
    fillColor: entity.fillColor,
    borderColor: entity.borderColor,
    uid: entity.uid,
    deletedAt: entity.deletedAt,
  } as Color;
};

export async function fetchColors(): Promise<Color[]> {
  const dbCatalogPath = ReadReplicaManager.instance().getFilePath(
    ReadReplicaTypes.Catalog,
  );
  const db = createCatalogDb(dbCatalogPath);

  const queryResult = await db
    .select()
    .from(colors)
    .where(isNull(colors.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item: DbColor) => mapQueryResultToDomainModel(item));
}
