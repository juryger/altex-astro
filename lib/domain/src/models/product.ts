import { z } from "zod";
import {
  CENTIMETERS_IN_METER,
  GRAMS_IN_KG,
  MILIMETERS_IN_CENTIMETER,
} from "../const/measurements";

export const ProductSchema = z
  .object({
    id: z.number(),
    productCode: z.string(),
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    unitId: z.number().optional(),
    unit: z.string().optional(),
    dimensionLengthMm: z.number().optional(),
    dimensionWidthMm: z.number().optional(),
    dimensionHeightMm: z.number().optional(),
    dimensionLengthCm: z.number().optional(),
    dimensionWidthCm: z.number().optional(),
    dimensionHeightCm: z.number().optional(),
    dimensionLengthMeter: z.number().optional(),
    dimensionWidthMeter: z.number().optional(),
    dimensionHeightMeter: z.number().optional(),
    weightGr: z.number().optional(),
    weightKg: z.number().optional(),
    quantityInPack: z.number().default(1),
    minQuantityToBuy: z.number().default(1),
    price: z.number().default(0),
    whsPrice1: z.number().default(0),
    whsPrice2: z.number().default(0),
    categoryId: z.number(),
    categorySlug: z.string(),
    categoryTitle: z.string(),
    colors: z.array(z.number()).optional(),
    imageUrl: z.string(),
    thumbnailImageUrl: z.string(),
    makerId: z.number().optional(),
    maker: z.string().optional(),
    makeCountryId: z.number().optional(),
    makeCountry: z.string().optional(),
    createdAt: z.date(),
    modifiedAt: z.date(),
    uid: z.string(),
    relatedProdcuts: z.array(z.string()).optional(),
  })
  .transform((data) => {
    var result = { ...data };
    result.dimensionLengthCm =
      data.dimensionLengthMm !== undefined
        ? data.dimensionLengthMm / MILIMETERS_IN_CENTIMETER
        : undefined;
    result.dimensionWidthCm =
      data.dimensionWidthMm !== undefined
        ? data.dimensionWidthMm / MILIMETERS_IN_CENTIMETER
        : undefined;
    result.dimensionHeightCm =
      data.dimensionHeightMm !== undefined
        ? data.dimensionHeightMm / MILIMETERS_IN_CENTIMETER
        : undefined;
    result.dimensionLengthMeter =
      data.dimensionLengthMm !== undefined
        ? data.dimensionLengthMm /
          (MILIMETERS_IN_CENTIMETER * CENTIMETERS_IN_METER)
        : undefined;
    result.dimensionWidthMeter =
      data.dimensionWidthMm !== undefined
        ? data.dimensionWidthMm /
          (MILIMETERS_IN_CENTIMETER * CENTIMETERS_IN_METER)
        : undefined;
    result.dimensionHeightMeter =
      data.dimensionHeightMm !== undefined
        ? data.dimensionHeightMm /
          (MILIMETERS_IN_CENTIMETER * CENTIMETERS_IN_METER)
        : undefined;
    result.weightKg =
      data.weightGr !== undefined ? data.weightGr / GRAMS_IN_KG : undefined;
    return result;
  });

export type Product = z.infer<typeof ProductSchema>;

// to calculate derived props use parse() method, i.e.
// const item = ProductSchema.parse(value);
