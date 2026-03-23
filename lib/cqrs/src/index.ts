export { type CacheResult, CacheManager } from "./utils/cache-manager";
export {
  type CommandManager,
  getCommandManager,
} from "./utils/command-manager";
export { type QueryManager, getQueryManager } from "./utils/query-manager";

export { ReadReplicaManager } from "./utils/read-replica-manager";

export { fetchCompanyInfo } from "./queries/company-info";
export { fetchDiscounts } from "./queries/discounts";
export { fetchMeasurementUnits } from "./queries/measurement-units";
export { fetchColors } from "./queries/colors";
export { fetchCategories, fetchCategoryBySlug } from "./queries/categories";
export { fetchProducts, fetchProductBySlug } from "./queries/products";
export { fetchCartCheckout } from "./queries/cart-checkout";
export { fetchReadReplica } from "./queries/read-replica";

export { checkoutCart } from "./commands/cart-checkout";
export { upsertGuestUser } from "./commands/guest-user";
export { upsertColor } from "./commands/color";
export { upsertDiscount } from "./commands/discount";
export { upsertMakeCountry } from "./commands/make-country";
export { upsertMaker } from "./commands/maker";
export { upsertMeasurementUnit } from "./commands/measurement-unit";
export { upsertCategory } from "./commands/category";
export { upsertProduct } from "./commands/product";
export { upsertProductColor } from "./commands/product-color";
export { setReadReplica } from "./commands/read-replica";
export { setSyncLog } from "./commands/sync-log";

export { fetchAllCategories, fetchAllProducts } from "./queries/search";
