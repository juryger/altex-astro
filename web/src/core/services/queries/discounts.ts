import { asc, createCatalogDb, SQL, discounts, isNull } from "@/lib/dal";
import type { Discount as DbDiscount, SQLiteColumn } from "@/lib/dal";
import { type Discount } from "@/lib/domain/";

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
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);

  const queryResult = await db
    .select()
    .from(discounts)
    .where(isNull(discounts.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
