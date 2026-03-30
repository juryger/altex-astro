import type {
  DatabaseTransaction,
  DatabaseSchema,
  MeasurementUnit as DBMeasurementUnit,
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
    categoryId: entity.categoryId,
    title: entity.title,
    description: entity.description !== undefined ? entity.description : null,
    hasImage: entity.hasImage !== undefined ? entity.hasImage : 0,
    unitId: entity.unitId,
    dimensionLengthMm:
      entity.dimensionLengthMm !== undefined ? entity.dimensionLengthMm : null,
    dimensionWidthMm:
      entity.dimensionWidthMm !== undefined ? entity.dimensionWidthMm : null,
    dimensionHeightMm:
      entity.dimensionHeightMm !== undefined ? entity.dimensionHeightMm : null,
    dimensionDiameterMm:
      entity.dimensionDiameterMm !== undefined
        ? entity.dimensionDiameterMm
        : null,
    weightGr: entity.weightGr !== undefined ? entity.weightGr : null,
    quantityInPack: entity.quantityInPack,
    minQuantityToBuy: entity.minQuantityToBuy,
    price: entity.price,
    whsPrice1: entity.whsPrice1,
    whsPrice2: entity.whsPrice2,
    makerId: entity.makerId !== undefined ? entity.makerId : null,
    makeCountryId:
      entity.makeCountryId !== undefined ? entity.makeCountryId : null,
    deletedAt: entity.deletedAt !== undefined ? entity.deletedAt : null,
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
        categoryId: value.categoryId,
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
    console.error("❌ ~ cqrs ~ category not found '%s'", value.categoryUid);
    throw new Error(
      `Unable to save product record as related category with id '${value.categoryUid}' could not be retrieved.`,
    );
  }

  let measurement: DBMeasurementUnit | undefined = undefined;
  if (value.unitUid !== undefined && value.unitUid.trim().length > 0) {
    measurement = tx
      .select()
      .from(measurementUnits)
      .where(eq(measurementUnits.uid, value.unitUid))
      .limit(1)
      .get();
    if (measurement === undefined) {
      console.error(
        "❌ ~ cqrs ~ measurement-unit not found '%s'",
        value.unitUid,
      );
      throw new Error(
        `Unable to save product record as related measurment unit with id '${value.unitUid}' could not be retrieved.`,
      );
    }
  }

  let country: DBMakeCountry | undefined = undefined;
  if (
    value.makeCountryUid !== undefined &&
    value.makeCountryUid.trim().length > 0
  ) {
    country = tx
      .select()
      .from(makeCountries)
      .where(eq(makeCountries.uid, value.makeCountryUid))
      .limit(1)
      .get();
    if (country === undefined) {
      console.error(
        "❌ ~ cqrs ~ make-country not found '%s'",
        value.makeCountryUid,
      );
      throw new Error(
        `Unable to save product record as related make country with id '${value.unitUid}' could not be retrieved.`,
      );
    }
  }

  let maker: DBMaker | undefined = undefined;
  if (value.makerUid !== undefined && value.makerUid.trim().length > 0) {
    maker = tx
      .select()
      .from(makers)
      .where(eq(makers.uid, value.makerUid))
      .limit(1)
      .get();
    if (maker === undefined) {
      console.error("❌ ~ cqrs ~ maker not found '%s'", value.unitUid);
      throw new Error(
        `Unable to save product record as related maker with id '${value.unitUid}' could not be retrieved.`,
      );
    }
  }

  const result = tx
    .insert(products)
    .values(
      mapDomainToDatabaseModel({
        ...value,
        categoryId: category.id,
        unitId: measurement?.id,
        makeCountryId: country?.id,
        makerId: maker?.id,
      }),
    )
    .onConflictDoUpdate({
      target: products.uid,
      set: {
        slug: value.slug,
        categoryId: category.id,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        unitId: measurement !== undefined ? measurement.id : null,
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
        makerId: maker !== undefined ? maker?.id : null,
        makeCountryId: country !== undefined ? country.id : null,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt !== undefined ? value.deletedAt : null,
      },
    })
    .returning({ insertedId: products.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
