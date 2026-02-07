import type { Discount } from "./discount";
import type { MeasurementUnit } from "./measurement-unit";
import type { ProductColor } from "./product-color";

type CatalogReferences = {
  measurementUnits: MeasurementUnit[];
  discounts: Discount[];
  productColors: ProductColor[];
};

export { type CatalogReferences };
