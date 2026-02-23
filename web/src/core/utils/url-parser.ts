import { APISearchParamNames, TextSeparators } from "../const";
import type { Sorting, Filtering, Paging } from "@/lib/domain";
import { SortOrder } from "@/lib/domain";
import { regexTrue } from "./regex";
import { defaultSorting } from "@/web/src/core/utils/sorting";
import { defaultPaging } from "@/web/src/core/utils/paging";

function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "string",
): string | undefined;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "number",
): number | undefined;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "boolean",
): boolean | undefined;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: string,
): unknown {
  if (
    !url ||
    !url.search ||
    !url.searchParams ||
    !url.searchParams.has(paramName)
  ) {
    return undefined;
  }

  let result = url.searchParams.get(paramName) ?? "";
  switch (type) {
    case "string":
      return String(result);
    case "number":
      return !isNaN(parseFloat(result)) && isFinite(parseFloat(result))
        ? Number(result)
        : -1;
    case "boolean":
      return regexTrue.test(result ?? "false");
    default:
      throw Error("unknown type");
  }
}

function extractUrlParamAll(url: URL | null, paramName: string): string[] {
  return url?.searchParams.getAll(paramName) ?? [];
}

function extractUrlPaging(url: URL | null): Paging {
  const result: Paging = { page: 0, pageSize: 0 };
  const page = extractUrlParam(url, APISearchParamNames.Page, "number");
  result.page = page !== undefined && page !== -1 ? page : defaultPaging.page;

  const pageSize = extractUrlParam(url, APISearchParamNames.PageSize, "number");
  result.pageSize =
    pageSize !== undefined && pageSize !== -1
      ? pageSize
      : defaultPaging.pageSize;

  return result;
}

function extractUrlSorting(url: URL | null): Sorting {
  const result: Sorting = { field: "", order: SortOrder.Ascending };

  const field = extractUrlParam(url, APISearchParamNames.SortField, "string");
  result.field = field !== undefined ? field : defaultSorting.field;

  const order = extractUrlParam(url, APISearchParamNames.SortOrder, "number");
  result.order = order !== undefined ? order : defaultSorting.order;

  return result;
}

function extractUrlFiltering(url: URL | null): Filtering[] {
  const filterValues = extractUrlParamAll(url, APISearchParamNames.Filter);
  const results = Array(filterValues.length);

  filterValues.forEach((item, index) => {
    const fieldAndValue = item.split(TextSeparators.Comma);
    results[index] = <Filtering>{
      field: fieldAndValue[0],
      value: fieldAndValue[1],
    };
  });

  return results;
}

export {
  extractUrlParam,
  extractUrlParamAll,
  extractUrlPaging,
  extractUrlSorting,
  extractUrlFiltering,
};
