import {
  upsertCategoryTx,
  upsertColorTx,
  upsertDiscountTx,
  upsertMakeCountryTx,
  upsertMakerTx,
  upsertMeasurementUnitTx,
  upsertProductColorTx,
  upsertProductTx,
} from "@/lib/cqrs";
import type { DatabaseSchema, DatabaseTransaction } from "@/lib/dal";
import type {
  Category,
  Color,
  Discount,
  MakeCountry,
  Maker,
  MeasurementUnit,
  Product,
  ProductColor,
} from "@/lib/domain";
import type {
  CatalogUpdatesColors,
  CatalogUpdatesCountries,
  CatalogUpdatesDiscounts,
  CatalogUpdatesGroups,
  CatalogUpdatesMakers,
  CatalogUpdatesMeasurements,
  CatalogUpdatesProductColors,
  CatalogUpdatesProducts,
  CatalogUpdatesSubgroups,
} from "src/models/catalog";
import { getSlugNamesConverter } from "src/utils/slug-names-converter";

const mapDiscountsToCommands = (
  value: CatalogUpdatesDiscounts,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const discounts = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        fromSum: x["@_start_summ"],
        title: x["@_title"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Discount,
  );
  for (let i = 0; i < discounts.length; i++) {
    const item = discounts[i];
    item !== undefined && result.push((tx) => upsertDiscountTx(tx, item));
  }
  return result;
};

const mapMeasurementsToCommands = (
  value: CatalogUpdatesMeasurements,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const measurements = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        code: x["@_code"],
        title: x["@_title"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as MeasurementUnit,
  );
  for (let i = 0; i < measurements.length; i++) {
    const item = measurements[i];
    item !== undefined &&
      result.push((tx) => upsertMeasurementUnitTx(tx, item));
  }
  return result;
};

const mapColorsToCommands = (
  value: CatalogUpdatesColors,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const colors = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        code: x["@_code"],
        title: x["@_title"],
        fillColor: x["@_fill_color"],
        borderColor: x["@_border_color"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Color,
  );
  for (let i = 0; i < colors.length; i++) {
    const item = colors[i];
    item !== undefined && result.push((tx) => upsertColorTx(tx, item));
  }
  return result;
};

const mapCountriesToCommands = (
  value: CatalogUpdatesCountries,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const countries = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        code: x["@_code"],
        title: x["@_title"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as MakeCountry,
  );
  for (let i = 0; i < countries.length; i++) {
    const item = countries[i];
    item !== undefined && result.push((tx) => upsertMakeCountryTx(tx, item));
  }
  return result;
};

const mapMakersToCommands = (
  value: CatalogUpdatesMakers,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const makers = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        title: x["@_title"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Maker,
  );
  for (let i = 0; i < makers.length; i++) {
    const item = makers[i];
    item !== undefined && result.push((tx) => upsertMakerTx(tx, item));
  }
  return result;
};

const mapGroupsToCommands = (
  value: CatalogUpdatesGroups,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const slugConverter = getSlugNamesConverter();
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const categories = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        title: x["@_title"],
        slug: slugConverter.transliterate(x["@_title"]),
        description: x["@_description"] !== "" ? x["@_description"] : undefined,
        hasImage: x["@_has_image"],
        totalProducts: 0, // calculated during read
        createdAt: createdAt,
        modifiedAt: createdAt,
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Category,
  );
  for (let i = 0; i < categories.length; i++) {
    const item = categories[i];
    item !== undefined && result.push((tx) => upsertCategoryTx(tx, item));
  }
  return result;
};

const mapSubgroupsToCommands = (
  value: CatalogUpdatesSubgroups,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const slugConverter = getSlugNamesConverter();
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const categories = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        title: x["@_title"],
        slug: slugConverter.transliterate(x["@_title"]),
        description: x["@_description"] !== "" ? x["@_description"] : undefined,
        hasImage: x["@_has_image"],
        totalProducts: 0, // calculated during read
        createdAt: createdAt,
        modifiedAt: createdAt,
        parentUid: x["@_parent_uid"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Category,
  );
  for (let i = 0; i < categories.length; i++) {
    const item = categories[i];
    item !== undefined && result.push((tx) => upsertCategoryTx(tx, item));
  }
  return result;
};

const mapProductsToCommands = (
  value: CatalogUpdatesProducts,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const slugConverter = getSlugNamesConverter();
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const products = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        code: slugConverter
          .transliterate(x["@_title"])
          .substring(0, 3)
          .concat(x["@_id"].toString()),
        title: x["@_title"],
        slug: slugConverter.transliterate(x["@_title"]),
        description: x["@_description"] !== "" ? x["@_description"] : undefined,
        categoryUid: x["@_parent_uid"],
        categoryId: 0, // category ID will be look up on insert/update by UID
        quantityInPack: x["@_pack"],
        minQuantityToBuy: x["@_pack_min"],
        price: parseStringAsFloat(x["@_cost_whs1"]),
        whsPrice1: parseStringAsFloat(x["@_cost_whs2"]),
        whsPrice2: parseStringAsFloat(x["@_cost_whs3"]),
        unitUid:
          x["@_measurement_uid"] !== "" ? x["@_measurement_uid"] : undefined,
        dimensionLengthMm:
          x["@_dim_length"] !== ""
            ? parseStringAsFloat(x["@_dim_length"])
            : undefined,
        dimensionWidthMm:
          x["@_dim_width"] !== ""
            ? parseStringAsFloat(x["@_dim_width"])
            : undefined,
        dimensionHeightMm:
          x["@_dim_height"] !== ""
            ? parseStringAsFloat(x["@_dim_height"])
            : undefined,
        dimensionDiameterMm:
          x["@_dim_diameter"] !== ""
            ? parseStringAsFloat(x["@_dim_diameter"])
            : undefined,
        weightGr:
          x["@_weight"] !== "" ? parseStringAsFloat(x["@_weight"]) : undefined,
        makeCountryUid:
          x["@_make_country_uid"] !== "" ? x["@_make_country_uid"] : undefined,
        makerUid: x["@_maker_uid"] !== "" ? x["@_maker_uid"] : undefined,
        hasImage: x["@_has_image"],
        createdAt: createdAt,
        modifiedAt: createdAt,
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as Product,
  );
  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    item !== undefined && result.push((tx) => upsertProductTx(tx, item));
  }
  return result;
};

const parseStringAsFloat = (value: string): number => {
  const normalizedValue =
    value.indexOf(",") !== -1 ? value.replace(",", ".") : value;
  return parseFloat(normalizedValue);
};

const mapProductColorsToCommands = (
  value: CatalogUpdatesProductColors,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  const productColors = value.data.map(
    (x) =>
      ({
        id: x["@_id"],
        uid: x["@_uid"],
        productId: -1,
        productUid: x["@_product_uid"],
        colorId: -1,
        colorUid: x["@_color_uid"],
        deletedAt: x["@_deleted"] === 1 ? createdAt : undefined,
      }) as ProductColor,
  );
  for (let i = 0; i < productColors.length; i++) {
    const item = productColors[i];
    item !== undefined && result.push((tx) => upsertProductColorTx(tx, item));
  }
  return result;
};

export {
  mapDiscountsToCommands,
  mapMeasurementsToCommands,
  mapColorsToCommands,
  mapCountriesToCommands,
  mapMakersToCommands,
  mapGroupsToCommands,
  mapSubgroupsToCommands,
  mapProductsToCommands,
  mapProductColorsToCommands,
};
