import type { Sorting, Paging, Filtering } from "@/lib/domain";
import { FilterOperator } from "@/lib/domain";
import { regexFilterParams, regexPageParams, regexSortParams } from "./regex";

interface RouteParser {
  getCatalogSorting(): Sorting | undefined;
  getCatalogPaging(): Paging | undefined;
  getCatalogFiltering(): Filtering[];
}

export default function getRouteParser(route?: string): RouteParser {
  return {
    getCatalogSorting: () => {
      const sortExp = regexSortParams;
      const match = route?.match(sortExp);
      if (!match || !match.groups) return undefined;
      return {
        field: match.groups.field,
        order: Number.parseInt(match.groups.direction, 10),
      } as Sorting;
    },
    getCatalogPaging: () => {
      const pagingExp = regexPageParams;
      const match = route?.match(pagingExp);
      if (!match || !match.groups) return undefined;
      return {
        page: parseInt(match.groups.offset, 10),
        pageSize: parseInt(match.groups.limit, 10),
      } as Paging;
    },
    getCatalogFiltering: () => {
      const result: Filtering[] = [];
      const filterExp = regexFilterParams;
      route?.matchAll(filterExp).forEach((match) => {
        if (match) {
          const item: Filtering = {
            field: "",
            value: "",
            operator: FilterOperator.Equals,
          };
          item.field = match.groups?.field ?? "";
          item.value = match.groups?.value ?? "";
          result.push(item);
        }
      });
      return result;
    },
  };
}
