import {
  EnvironmentNames,
  ReadReplicaTypes,
  selectEnvironment,
} from "@/lib/domain";
import { asc, createCatalogDb, SQL, discounts, isNull } from "@/lib/dal";
import type { Discount as DbDiscount, SQLiteColumn } from "@/lib/dal";
import { type Discount } from "@/lib/domain";
import { ReadReplicaManager } from "../read-replica-manager";

const columnFromSum: SQLiteColumn = discounts.fromSum;

const getSortCondition = (): SQL => {
  return asc(columnFromSum);
};

const mapQueryResultToDomainModel = (entity: DbDiscount): Discount => {
  return <Discount>{
    id: entity.id,
    code: entity.code,
    title: entity.title,
    fromSum: entity.fromSum,
  };
};

export async function fetchDiscounts(): Promise<Discount[]> {
  const dbCatalogPath = ReadReplicaManager.instance().getFilePath(
    ReadReplicaTypes.Catalog,
  );
  const db = createCatalogDb(dbCatalogPath);

  const queryResult = await db
    .select()
    .from(discounts)
    .where(isNull(discounts.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item: DbDiscount) =>
    mapQueryResultToDomainModel(item),
  );
}
