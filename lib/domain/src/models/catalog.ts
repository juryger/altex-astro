import type { Discount } from "./discount";
import type { MeasurementUnit } from "./measurement-unit";
import type { Color } from "./color";

type Catalog = {
  measurementUnits: MeasurementUnit[];
  discounts: Discount[];
  colors: Color[];
};

export { type Catalog };
