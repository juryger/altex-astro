import type {
  CatalogDb,
  DatabaseTransaction,
  DatabaseSchema,
  MakeCountry as DBMakeCountry,
  Maker as DBMaker,
  Product as DBProduct,
} from "@/lib/dal";
import {
  categories,
  createCatalogDb,
  products,
  eq,
  measurementUnits,
  makeCountries,
  makers,
} from "@/lib/dal";
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

export function upsertProductTx(
  tx: DatabaseTransaction<DatabaseSchema>,
  value: Product,
): string {
  const category = tx
    .select()
    .from(categories)
    .where(eq(categories.uid, value.categoryUid))
    .limit(1)
    .get();
  if (category === undefined) {
    throw new Error(
      `Unable to save product record as its category with id '${value.categoryUid}' could not be retrieved.`,
    );
  }

  const measurement = tx
    .select()
    .from(measurementUnits)
    .where(eq(measurementUnits.uid, value.unitUid))
    .limit(1)
    .get();
  if (measurement === undefined) {
    throw new Error(
      `Unable to save product record as its measurment unit with id '${value.unitUid}' could not be retrieved.`,
    );
  }

  let country: DBMakeCountry | undefined = undefined;
  if (value.makeCountryUid !== undefined) {
    country = tx
      .select()
      .from(makeCountries)
      .where(eq(makeCountries.uid, value.makeCountryUid))
      .limit(1)
      .get();
    if (country === undefined) {
      throw new Error(
        `Unable to save product record as its make country with id '${value.unitUid}' could not be retrieved.`,
      );
    }
  }

  let maker: DBMaker | undefined = undefined;
  if (value.makerUid !== undefined) {
    maker = tx
      .select()
      .from(makers)
      .where(eq(makers.uid, value.makerUid))
      .limit(1)
      .get();
    if (maker === undefined) {
      throw new Error(
        `Unable to save product record as its maker with id '${value.unitUid}' could not be retrieved.`,
      );
    }
  }

  const result = tx
    .insert(products)
    .values(
      mapDomainToDatabaseModel({
        ...value,
        categoryId: category.id,
        unitId: measurement.id,
        makeCountryId: country?.id,
        makerId: maker?.id,
      }),
    )
    .onConflictDoUpdate({
      target: products.uid,
      set: {
        slug: value.slug,
        categoryId: category?.id,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        unitId: measurement?.id,
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
        makerId: maker?.id,
        makeCountryId: country?.id,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: products.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
