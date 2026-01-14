import { NavPathNames } from "../const";
import type { Category } from "../models/category";
import type { Product } from "../models/product";
import { getNavPathManager, type NavPathItem } from "./nav-path-manager";

type BreadcrumbItem = {
  path: string;
  value: string;
};

const mapNavPathItemToBreadcrumb = (
  item: NavPathItem,
  url: string,
  activeProduct?: Product,
  activeCategory?: Category,
  activeParentCategory?: Category
): BreadcrumbItem[] => {
  const result: BreadcrumbItem[] = [];
  if (!item.displayOptions.isBreadcrumbs) {
    if (url.indexOf(`/${NavPathNames.Categories}`) !== -1) {
      if (activeParentCategory !== undefined) {
        result.push({
          path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${activeParentCategory.slug}`,
          value: activeParentCategory.title,
        });
      }
      if (activeCategory !== undefined) {
        result.push({
          path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${activeCategory.slug}`,
          value: activeCategory.title,
        });
      }
    } else if (url.indexOf(`/${NavPathNames.Products}`) !== -1) {
      if (activeProduct !== undefined && activeCategory !== undefined) {
        result.push(
          {
            path: `${NavPathNames.Catalog}/${NavPathNames.Categories}/${activeCategory.slug}`,
            value: activeCategory.title,
          },
          {
            path: `${NavPathNames.Catalog}/${NavPathNames.Products}/${activeProduct.slug}`,
            value: activeProduct.title,
          }
        );
      }
    } else {
      console.warn(
        "🛠️ ~ getBreadcrumbsFromPath ~ path item is marked as excluded from the breadcrumbs and will be skipped:",
        item
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
  activeProduct?: Product,
  activeCategory?: Category,
  activeParentCategory?: Category
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
    pathCollection
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
        item
      );
      continue;
    }

    const values = mapNavPathItemToBreadcrumb(
      navPathItem,
      overallNavUrl,
      activeProduct,
      activeCategory,
      activeParentCategory
    );
    result.push(...values);
  }

  console.log("🛠️ ~ getBreadcrumbsFromPath ~ result:", result);
  return result;
};

export { getBreadcrumbsFromPath, type BreadcrumbItem };
