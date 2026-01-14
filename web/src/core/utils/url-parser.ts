import { APISearchParamNames } from "../const";
import { defaultPaging, type Paging } from "../models/paging";
import { regexTrue } from "./regex";

function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "string"
): string;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "number"
): number;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: "boolean"
): boolean;
function extractUrlParam(
  url: URL | null,
  paramName: string,
  type: string
): unknown {
  if (!url || !url.search || !url.searchParams) {
    return undefined;
  }

  let result: string = "";
  if (url.searchParams.has(paramName)) {
    result = url.searchParams.get(paramName) ?? "";
  }

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
  const paging: Paging = { offset: 0, limit: 0 };
  const offset = extractUrlParam(url, APISearchParamNames.PageOffset, "number");
  paging.offset = offset !== -1 ? offset : defaultPaging.offset;

  const limit = extractUrlParam(url, APISearchParamNames.PageLimit, "number");
  paging.limit = limit !== -1 ? limit : defaultPaging.limit;
  return paging;
}

export { extractUrlParam, extractUrlPaging };
