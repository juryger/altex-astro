
import { getNavPathResolver } from '../utils/nav-path-resolver';

interface BreadcrumbItem {
  path: string,
  value: string,
  url: string,
};

const getBreadcrumbsFromPath = (path: string): Array<BreadcrumbItem> => {
  const splitPath = path.split('/').reverse();
  console.log("🚀 ~ getBreadcrumbsFromPath ~ path: %s, parsed collection: %o", path, splitPath)
  
  if (path.endsWith("/")) {
    splitPath.pop();
  }
  
  var currentRelativePath = '';
  const pathResolver = getNavPathResolver();
  const result: Array<BreadcrumbItem> = [];
  
  while(splitPath.length > 0) { 
    const pathItem =  splitPath.pop() ?? "";
    currentRelativePath += `${pathItem}/`;
    //console.log("🚀 ~ Breadcrumbs component ~ processing path item: %s", pathItem)

    const resolvedPathItem = pathResolver.resolvePathItem(pathItem);
    console.assert(resolvedPathItem !== undefined, "🚀 ~ getBreadcrumbsFromPath ~ could not resolve path item: %s", pathItem);

    if (!resolvedPathItem) continue;
    if (!resolvedPathItem.displayOptions.isBreadcrumbs) {
      console.log("🚀 ~ getBreadcrumbsFromPath ~ path item is marked as excluded from the breadcrumbs and will be skipped:", pathItem)
      continue;
    }
    
    result.push({
      path: resolvedPathItem.path,
      value: resolvedPathItem.value,
      url: currentRelativePath,
    });
  }

  console.log("🚀 ~ getBreadcrumbsFromPath ~ result:", result)
  return result;
}

export { getBreadcrumbsFromPath, type BreadcrumbItem };