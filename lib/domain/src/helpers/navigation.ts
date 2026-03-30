const defaultPathSeparator: string = "/";

function constructNavigationPath({
  items,
  pathSeparator,
}: {
  items: Array<string>;
  pathSeparator?: string | undefined;
}): string {
  var result = "";
  items.forEach(
    (item, index) =>
      (result = result.concat(
        item,
        index !== items.length - 1
          ? (pathSeparator ?? defaultPathSeparator)
          : "",
      )),
  );
  return result;
}

export { constructNavigationPath };
