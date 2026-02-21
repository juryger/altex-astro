import { SortFields, SortOrder } from "../const/sorting";

type Sorting = {
  field: string;
  order: SortOrder;
};

const defaultSorting: Sorting = {
  field: SortFields.Title,
  order: SortOrder.Ascending,
};

export { type Sorting, defaultSorting };
