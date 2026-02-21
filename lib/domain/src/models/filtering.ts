import type { FilterOperator } from "../const/filtering";

type Filtering = {
  field: string;
  value: string;
  operator: FilterOperator;
};

export { type Filtering };
