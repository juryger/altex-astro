const pathSeparator: string = "/";

export function constructNavigationPaths(...args: Array<string>): string {
  var result = "";
  args.forEach(
    (item, index) =>
      (result = result.concat(
        item,
        index !== args.length - 1 ? pathSeparator : "",
      )),
  );
  return result;
}
