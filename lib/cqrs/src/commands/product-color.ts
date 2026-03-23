import type { ProductColor as DbProductColor } from "@/lib/dal";
import { createCatalogDb, productColors } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { ProductColor } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: ProductColor): DbProductColor => {
  return {
    uid: entity.uid,
    productId: entity.productId,
    colorId: entity.colorId,
  } as DbProductColor;
};

export async function upsertProductColor(value: ProductColor): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(productColors)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: productColors.uid,
      set: {
        productId: value.productId,
        colorId: value.colorId,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: productColors.id });

  return result.at(0)?.insertedId ?? 0;
}
