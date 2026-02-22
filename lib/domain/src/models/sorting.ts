import { CategoriesSortFields, SortOrder } from "../const/sorting";

type Sorting = {
  field: string;
  order: SortOrder;
};

const defaultSorting: Sorting = {
  field: CategoriesSortFields.Title,
  order: SortOrder.Ascending,
};

export { type Sorting, defaultSorting };
