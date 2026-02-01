import { SortOrder } from "../const";

type Sorting = {
  field: string;
  order: SortOrder;
};

const defaultSorting: Sorting = {
  field: "title",
  order: SortOrder.Ascending,
};

export { type Sorting, defaultSorting };
