import type { Sorting } from "@/lib/domain";
import { CategoriesSortFields, SortOrder } from "@/lib/domain";

const defaultSorting: Sorting = {
  field: CategoriesSortFields.Title,
  order: SortOrder.Ascending,
};

export { defaultSorting };
