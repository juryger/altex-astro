import { NavPathNames } from "../const";
import { getNavPathManager, type NavPathItem } from "./nav-path-manager";
import type { ActiveCatalogItem } from "./session-manager";

type BreadcrumbItem = {
  path: string;
  value: string;
};

const mapNavPathItemToBreadcrumb = (
  item: NavPathItem,
  url: string,
  catalogItem?: ActiveCatalogItem,
): BreadcrumbItem[] => {
  const result: BreadcrumbItem[] = [];
  if (!item.displayOptions.isBreadcrumbs) {
    if (url.indexOf(`/${NavPathNames.Categories}`) !== -1) {
      if (catalogItem && catalogItem.parentCategory) {
        result.push({
          path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${catalogItem.parentCategory.slug}`,
          value: catalogItem.parentCategory.title,
        });
      }
      if (catalogItem && catalogItem.category) {
        result.push({
          path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${catalogItem.category.slug}`,
          value: catalogItem.category.title,
        });
      }
    } else if (url.indexOf(`/${NavPathNames.Products}`) !== -1) {
      if (catalogItem && catalogItem.category && catalogItem.product) {
        result.push(
          {
            path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${catalogItem.category.slug}`,
            value: catalogItem.category.title,
          },
          {
            path: `${NavPathNames.Catalog}/${NavPathNames.Products}/${catalogItem.product.slug}`,
            value: catalogItem.product.title,
          },
        );
      }
    } else {
      console.warn(
        "🛠️ ~ getBreadcrumbsFromPath ~ path item is marked as excluded from the breadcrumbs and will be skipped:",
        item,
      );
    }
  } else {
    result.push({
      path: item.path,
      value: item.value,
    });
  }
  return result;
};

const getBreadcrumbsFromPath = (
  fullPath: string,
  catalogItem?: ActiveCatalogItem,
): Array<BreadcrumbItem> => {
  const pathCollection = fullPath.endsWith("/")
    ? fullPath
        .substring(0, fullPath.length - 1)
        .split("/")
        .reverse()
    : fullPath.split("/").reverse();

  console.log(
    "🛠️ ~ getBreadcrumbsFromPath ~ path: %s, parsed: %o",
    fullPath,
    pathCollection,
  );

  var overallNavUrl = "";
  const navPathManager = getNavPathManager();
  const result: BreadcrumbItem[] = [];

  while (pathCollection.length > 0) {
    const item = pathCollection.pop() ?? "";
    overallNavUrl += `${item}/`;

    const navPathItem = navPathManager.resolvePathElement(item);
    if (!navPathItem) {
      console.warn(
        "🛠️ ~ getBreadcrumbsFromPath ~ could not resolve path element:",
        item,
      );
      continue;
    }

    const values = mapNavPathItemToBreadcrumb(
      navPathItem,
      overallNavUrl,
      catalogItem,
    );
    result.push(...values);
  }

  console.log("🛠️ ~ getBreadcrumbsFromPath ~ result:", result);
  return result;
};

export { getBreadcrumbsFromPath, type BreadcrumbItem };
