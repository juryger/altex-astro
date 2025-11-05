import { regexTruePattern } from "./regex";

function extractUrlParamValue(
  url: URL | null,
  paramName: string,
  type: "string"
): string;
function extractUrlParamValue(
  url: URL | null,
  paramName: string,
  type: "number"
): number;
function extractUrlParamValue(
  url: URL | null,
  paramName: string,
  type: "boolean"
): boolean;
function extractUrlParamValue(
  url: URL | null,
  paramName: string,
  type: string
): unknown {
  if (!url || !url.search || !url.searchParams) {
    return undefined;
  }

  var result: string = "";
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
      return regexTruePattern.test(result ?? "false");
    default:
      throw Error("unknown type");
  }
}

export { extractUrlParamValue };
