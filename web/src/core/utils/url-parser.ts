import { APISearchParamNames } from "../const";
import { defaultPaging, type Paging } from "../models/paging";
import { regexTrue } from "./regex";

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

function extractUrlPaging(url: URL | null): Paging {
  const paging: Paging = { page: 0, pageSize: 0 };
  const page = extractUrlParam(url, APISearchParamNames.Page, "number");
  paging.page = page !== undefined && page !== -1 ? page : defaultPaging.page;

  const pageSize = extractUrlParam(url, APISearchParamNames.PageSize, "number");
  paging.pageSize =
    pageSize !== undefined && pageSize !== -1
      ? pageSize
      : defaultPaging.pageSize;
  return paging;
}

export { extractUrlParam, extractUrlPaging };
