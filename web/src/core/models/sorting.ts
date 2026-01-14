import { SortOrder } from "../const";

type Sorting = {
  field: string;
  order: string;
};

const defaultSorting: Sorting = {
  field: "title",
  order: SortOrder.Ascending,
};

export { type Sorting, defaultSorting };
