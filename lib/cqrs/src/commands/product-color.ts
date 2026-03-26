import type {
  DatabaseTransaction,
  DatabaseSchema,
  Product as DBProduct,
  Color as DBColor,
  ProductColor as DbProductColor,
} from "@/lib/dal";
import {
  eq,
  createCatalogDb,
  productColors,
  products,
  colors,
} from "@/lib/dal";
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

export function upsertProductColorTx(
  tx: DatabaseTransaction<DatabaseSchema>,
  value: ProductColor,
): string {
  const product = tx
    .select()
    .from(products)
    .where(eq(products.uid, value.productUid))
    .limit(1)
    .get();
  if (product === undefined) {
    throw new Error(
      `Unable to save product color as its based product with id '${value.productUid}' could not be retrieved.`,
    );
  }

  const color = tx
    .select()
    .from(colors)
    .where(eq(colors.uid, value.colorUid))
    .limit(1)
    .get();
  if (color === undefined) {
    throw new Error(
      `Unable to save product color as its based color with id '${value.colorUid}' could not be retrieved.`,
    );
  }

  const result = tx
    .insert(productColors)
    .values(
      mapDomainToDatabaseModel({
        ...value,
        productId: product.id,
        colorId: color.id,
      }),
    )
    .onConflictDoUpdate({
      target: productColors.uid,
      set: {
        productId: product.id,
        colorId: color.id,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: productColors.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
