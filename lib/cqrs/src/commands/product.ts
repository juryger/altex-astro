import type {
  CatalogDb,
  CatalogDbTransaction,
  Product as DBProduct,
} from "@/lib/dal";
import { createCatalogDb, products } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { Product } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: Product): DBProduct => {
  return {
    uid: entity.uid,
    slug: entity.slug,
    title: entity.title,
    description: entity.description ?? null,
    hasImage: entity.hasImage,
    unitId: entity.unitId,
    dimensionLengthMm: entity.dimensionLengthMm ?? null,
    dimensionWidthMm: entity.dimensionWidthMm ?? null,
    dimensionHeightMm: entity.dimensionHeightMm ?? null,
    dimensionDiameterMm: entity.dimensionDiameterMm ?? null,
    weightGr: entity.weightGr ?? null,
    quantityInPack: entity.quantityInPack,
    minQuantityToBuy: entity.minQuantityToBuy,
    price: entity.price,
    whsPrice1: entity.whsPrice1,
    whsPrice2: entity.whsPrice2,
    makerId: entity.makerId,
    makeCountryId: entity.makeCountryId,
  } as DBProduct;
};

export async function upsertProduct(value: Product): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(products)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: products.uid,
      set: {
        slug: value.slug,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        unitId: value.unitId,
        dimensionLengthMm: value.dimensionLengthMm,
        dimensionWidthMm: value.dimensionWidthMm,
        dimensionHeightMm: value.dimensionHeightMm,
        dimensionDiameterMm: value.dimensionDiameterMm,
        weightGr: value.weightGr,
        quantityInPack: value.quantityInPack,
        minQuantityToBuy: value.minQuantityToBuy,
        price: value.price,
        whsPrice1: value.whsPrice1,
        whsPrice2: value.whsPrice2,
        makerId: value.makerId,
        makeCountryId: value.makeCountryId,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: products.id });
  return result.at(0)?.insertedId ?? 0;
}

export async function upsertProductTx(
  tx: CatalogDbTransaction,
  value: Product,
): Promise<number> {
  const result = await tx
    .insert(products)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: products.uid,
      set: {
        slug: value.slug,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        unitId: value.unitId,
        dimensionLengthMm: value.dimensionLengthMm,
        dimensionWidthMm: value.dimensionWidthMm,
        dimensionHeightMm: value.dimensionHeightMm,
        dimensionDiameterMm: value.dimensionDiameterMm,
        weightGr: value.weightGr,
        quantityInPack: value.quantityInPack,
        minQuantityToBuy: value.minQuantityToBuy,
        price: value.price,
        whsPrice1: value.whsPrice1,
        whsPrice2: value.whsPrice2,
        makerId: value.makerId,
        makeCountryId: value.makeCountryId,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: products.id });
  return result.at(0)?.insertedId ?? 0;
}
