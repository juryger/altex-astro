import type { FilterOperator } from "../const";

type Filtering = {
  field: string;
  value: string;
  operator: FilterOperator;
};

export { type Filtering };
