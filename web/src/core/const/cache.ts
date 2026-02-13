const CACHE_LOAD_RETRY_ATTEMPS = 1;
const CACHE_LOAD_RETRY_DELAY_MS = 500;
const CACHE_ITEMS_LIMIT = 50;
const CACHE_ITEM_LOCK_TIMEOUT_1MN = 60000;
const CACHE_STALE_TIMEOUT_1MN = 60000;
const CACHE_STALE_TIMEOUT_5MN = 300000;
const CACHE_STALE_TIMEOUT_1HR = 3600000;

enum CacheKeys {
  ProductColors = "product-colors",
  MeasurementUnits = "measurement-units",
  Discounts = "discounts",
  CategoriesAll = "categories:all",
  CategoriesRoot = "categories:root",
  CategoriesParent = "categories:parent",
  CategoryItem = "category-item",
  Products = "products",
  ProductItem = "product-item",
}

export {
  CACHE_LOAD_RETRY_ATTEMPS,
  CACHE_LOAD_RETRY_DELAY_MS,
  CACHE_ITEM_LOCK_TIMEOUT_1MN,
  CACHE_STALE_TIMEOUT_1MN,
  CACHE_STALE_TIMEOUT_5MN,
  CACHE_STALE_TIMEOUT_1HR,
  CACHE_ITEMS_LIMIT,
  CacheKeys,
};
