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
import {
  EnvironmentNames,
  regexTrue,
  selectEnvironment,
  type Category,
  type Color,
  type Discount,
  type MakeCountry,
  type Maker,
  type MeasurementUnit,
  type Product,
  type ProductColor,
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
  discount_item,
} from "src/models/catalog";
import { getSlugNamesConverter } from "src/utils/slug-names-converter";

const withTracing = regexTrue.test(
  selectEnvironment(EnvironmentNames.ENABLE_TRACING),
);

const mapDiscountsToCommands = (
  value: CatalogUpdatesDiscounts,
  createdAt: Date,
): Array<
  (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
> => {
  const result: Array<
    (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
  > = [];
  withTracing && console.log("🐾 ~ modesl-mapping ~ discounts");
  const discounts = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            fromSum: parseStringAsFloat(x["@_start_summ"]),
            title: x["@_title"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Discount,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          fromSum: parseStringAsFloat(value.data["@_start_summ"]),
          title: value.data["@_title"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Discount,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ measurements");
  const measurements = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            code: x["@_code"],
            title: x["@_title"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as MeasurementUnit,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          code: value.data["@_code"],
          title: value.data["@_title"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as MeasurementUnit,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ colors");
  const colors = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            code: x["@_code"],
            title: x["@_title"],
            fillColor: x["@_fill_color"],
            borderColor: x["@_border_color"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Color,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          code: value.data["@_code"],
          title: value.data["@_title"],
          fillColor: value.data["@_fill_color"],
          borderColor: value.data["@_border_color"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Color,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ countries");
  const countries = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            code: x["@_code"],
            title: x["@_title"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as MakeCountry,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          code: value.data["@_code"],
          title: value.data["@_title"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as MakeCountry,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ makers");
  const makers = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            title: x["@_title"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Maker,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          title: value.data["@_title"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Maker,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ groups");
  const categories = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            title: x["@_title"],
            slug: slugConverter.transliterate(x["@_title"]),
            description:
              x["@_description"] !== "" ? x["@_description"] : undefined,
            hasImage: parseInt(x["@_has_image"], 10),
            imageUrl: "", // calculated field
            thumbnailImageUrl: "", // calculated field
            totalProducts: 0, // calculated during read
            createdAt: createdAt,
            modifiedAt: createdAt,
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Category,
      )
    : [
        {
          id: parseInt(value.data["@_id"]),
          uid: value.data["@_uid"],
          title: value.data["@_title"],
          slug: slugConverter.transliterate(value.data["@_title"]),
          description:
            value.data["@_description"] !== ""
              ? value.data["@_description"]
              : undefined,
          hasImage: parseInt(value.data["@_has_image"], 10),
          imageUrl: "", // calculated field
          thumbnailImageUrl: "", // calculated field
          totalProducts: 0, // calculated field
          createdAt: createdAt,
          modifiedAt: createdAt,
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Category,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ subgroups");
  const categories = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            title: x["@_title"],
            slug: slugConverter.transliterate(x["@_title"]),
            description:
              x["@_description"] !== "" ? x["@_description"] : undefined,
            hasImage: parseInt(x["@_has_image"], 10),
            imageUrl: "", // calculated field
            thumbnailImageUrl: "", // calculated field
            totalProducts: 0, // calculated field
            createdAt: createdAt,
            modifiedAt: createdAt,
            parentUid: x["@_parent_uid"],
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Category,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          title: value.data["@_title"],
          slug: slugConverter.transliterate(value.data["@_title"]),
          description:
            value.data["@_description"] !== ""
              ? value.data["@_description"]
              : undefined,
          hasImage: parseInt(value.data["@_has_image"], 10),
          imageUrl: "", // calculated field
          thumbnailImageUrl: "", // calculated field
          totalProducts: 0, // calculated field
          createdAt: createdAt,
          modifiedAt: createdAt,
          parentUid: value.data["@_parent_uid"],
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Category,
      ];
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
  withTracing && console.log("🐾 ~ modesl-mapping ~ products");
  const products = Array.isArray(value.data)
    ? value.data.map(
        (x) =>
          ({
            id: parseInt(x["@_id"], 10),
            uid: x["@_uid"],
            code: slugConverter
              .transliterate(x["@_title"])
              .substring(0, 3)
              .concat(x["@_id"].toString()),
            title: x["@_title"],
            slug: slugConverter.transliterate(x["@_title"]),
            description:
              x["@_description"] !== "" ? x["@_description"] : undefined,
            categoryUid: x["@_parent_uid"],
            categoryId: 0, // category ID will be look up on insert/update by UID
            categorySlug: "",
            categoryTitle: "",
            quantityInPack: parseInt(x["@_pack"], 10),
            minQuantityToBuy: parseInt(x["@_pack_min"], 10),
            price: parseStringAsFloat(x["@_cost_whs1"]),
            whsPrice1: parseStringAsFloat(x["@_cost_whs2"]),
            whsPrice2: parseStringAsFloat(x["@_cost_whs3"]),
            unitUid:
              x["@_measurement_uid"] !== ""
                ? x["@_measurement_uid"]
                : undefined,
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
              x["@_weight"] !== ""
                ? parseStringAsFloat(x["@_weight"])
                : undefined,
            makeCountryUid:
              x["@_make_country_uid"] !== ""
                ? x["@_make_country_uid"]
                : undefined,
            makerUid: x["@_maker_uid"] !== "" ? x["@_maker_uid"] : undefined,
            hasImage: parseInt(x["@_has_image"], 10),
            imageUrl: "", // calculated field
            thumbnailImageUrl: "", // calculated field
            createdAt: createdAt,
            modifiedAt: createdAt,
            deletedAt:
              parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
          }) as Product,
      )
    : [
        {
          id: parseInt(value.data["@_id"], 10),
          uid: value.data["@_uid"],
          code: slugConverter
            .transliterate(value.data["@_title"])
            .substring(0, 3)
            .concat(value.data["@_id"]),
          title: value.data["@_title"],
          slug: slugConverter.transliterate(value.data["@_title"]),
          description:
            value.data["@_description"] !== ""
              ? value.data["@_description"]
              : undefined,
          categoryUid: value.data["@_parent_uid"],
          categoryId: 0, // category ID will be look up on insert/update by UID
          categorySlug: "",
          categoryTitle: "",
          quantityInPack: parseInt(value.data["@_pack"], 10),
          minQuantityToBuy: parseInt(value.data["@_pack_min"], 10),
          price: parseStringAsFloat(value.data["@_cost_whs1"]),
          whsPrice1: parseStringAsFloat(value.data["@_cost_whs2"]),
          whsPrice2: parseStringAsFloat(value.data["@_cost_whs3"]),
          unitUid:
            value.data["@_measurement_uid"] !== ""
              ? value.data["@_measurement_uid"]
              : undefined,
          dimensionLengthMm:
            value.data["@_dim_length"] !== ""
              ? parseStringAsFloat(value.data["@_dim_length"])
              : undefined,
          dimensionWidthMm:
            value.data["@_dim_width"] !== ""
              ? parseStringAsFloat(value.data["@_dim_width"])
              : undefined,
          dimensionHeightMm:
            value.data["@_dim_height"] !== ""
              ? parseStringAsFloat(value.data["@_dim_height"])
              : undefined,
          dimensionDiameterMm:
            value.data["@_dim_diameter"] !== ""
              ? parseStringAsFloat(value.data["@_dim_diameter"])
              : undefined,
          weightGr:
            value.data["@_weight"] !== ""
              ? parseStringAsFloat(value.data["@_weight"])
              : undefined,
          makeCountryUid:
            value.data["@_make_country_uid"] !== ""
              ? value.data["@_make_country_uid"]
              : undefined,
          makerUid:
            value.data["@_maker_uid"] !== ""
              ? value.data["@_maker_uid"]
              : undefined,
          hasImage: parseInt(value.data["@_has_image"], 10),
          imageUrl: "", // calculated field
          thumbnailImageUrl: "", // calculated field
          createdAt: createdAt,
          modifiedAt: createdAt,
          deletedAt:
            parseInt(value.data["@_deleted"], 10) === 1 ? createdAt : undefined,
        } as Product,
      ];
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
        id: parseInt(x["@_id"], 10),
        uid: x["@_uid"],
        productId: 0, // calculated field
        productUid: x["@_product_uid"],
        colorId: 0, // calculated field
        colorUid: x["@_color_uid"],
        deletedAt: parseInt(x["@_deleted"], 10) === 1 ? createdAt : undefined,
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
