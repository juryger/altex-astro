import { createCatalogDb } from "@/lib/dal/src";
import { discounts } from "@/lib/dal/src/schema/catalog";
import type { Discount } from "@/web/src/core/models/discount";
import type { Discount as DbDiscount } from "@/lib/dal/src/types";
import { isNull } from "@/lib/dal";

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
    .where(isNull(discounts.deletedAt));

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
