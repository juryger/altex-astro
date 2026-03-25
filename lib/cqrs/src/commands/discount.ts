import type { CatalogDbTransaction, Discount as DBDiscount } from "@/lib/dal";
import { createCatalogDb, discounts } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { Discount } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: Discount): DBDiscount => {
  return {
    uid: entity.uid,
    fromSum: entity.fromSum,
    title: entity.title,
  } as DBDiscount;
};

export async function upsertDiscount(value: Discount): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(discounts)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: discounts.uid,
      set: {
        fromSum: value.fromSum,
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: discounts.id });
  return result.at(0)?.insertedId ?? 0;
}

export function upsertDiscountTx(
  tx: CatalogDbTransaction,
  value: Discount,
): string {
  const result = tx
    .insert(discounts)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: discounts.uid,
      set: {
        fromSum: value.fromSum,
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: discounts.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
