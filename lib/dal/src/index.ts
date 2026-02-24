import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import * as catalog from "./schema/catalog/index.js";
import * as operations from "./schema/operations/index.js";
import * as general from "./schema/general/index.js";

const createGeneralDb = (
  path: string | undefined,
): BetterSQLite3Database<typeof general> => {
  const clientOperations = new Database(path, {
    fileMustExist: true,
  });
  clientOperations.pragma("journal_mode = WAL");
  return drizzle({ client: clientOperations, schema: general });
};

const createOperationsDb = (
  path: string | undefined,
): BetterSQLite3Database<typeof operations> => {
  const clientOperations = new Database(path, {
    fileMustExist: true,
  });
  clientOperations.pragma("journal_mode = WAL");
  return drizzle({ client: clientOperations, schema: operations });
};

const createCatalogDb = (
  path: string | undefined,
): BetterSQLite3Database<typeof catalog> => {
  const clientCatalog = new Database(path, {
    fileMustExist: true,
  });
  clientCatalog.pragma("journal_mode = WAL");
  return drizzle({ client: clientCatalog, schema: catalog, logger: true });
};

//createGeneralDb(process.env.DB_GENERAL_PATH);
//createOperationsDb(process.env.DB_OPERATIONS_PATH);
//createCatalogDb(process.env.DB_CATALOG_PATH);

export {
  eq,
  lt,
  gte,
  ne,
  isNull,
  isNotNull,
  asc,
  desc,
  sql,
  or,
  and,
} from "drizzle-orm";

export type { SQLiteColumn, SQLiteTransaction } from "drizzle-orm/sqlite-core";
export { SQL } from "drizzle-orm/sql";
export { CompanyInfoKeys } from "../../domain/src/const/company-info.js";

export {
  categories,
  colors,
  discounts,
  makers,
  makeCountries,
  productColors,
  products,
  measurementUnits,
  relatedProducts,
  catalogVersion,
} from "./schema/catalog/index.js";

export {
  cartCheckout,
  cartCheckoutItems,
  guests,
  notificationAddressees,
  notifications,
  readReplicas,
  operationsVersion,
} from "./schema/operations/index.js";

export { info, generalVersion } from "./schema/general/index.js";

export type {
  CatalogVersion,
  MeasurementUnit,
  Color,
  MakeCountry,
  Maker,
  Discount,
  Category,
  Product,
  RelatedProduct,
  ProductColor,
  OperationVersion,
  ReadReplica,
  Guest,
  CartCheckout,
  CartCheckoutItem,
  Notification,
  NotificationAddressee,
  GeneralVersion,
  Info,
} from "./types/index.js";

export { createGeneralDb, createOperationsDb, createCatalogDb };
