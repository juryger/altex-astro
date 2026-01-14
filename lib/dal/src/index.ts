import Database from "better-sqlite3";
import { BetterSQLite3Database, drizzle } from "drizzle-orm/better-sqlite3";
import * as catalog from "./schema/catalog/index.js";
import * as operations from "./schema/operations/index.js";

export { eq, lt, gte, ne } from "drizzle-orm";

export type {
  MeasurementUnit,
  Color,
  CountryMake,
  Discount,
  Category,
  Product,
  RelatedProduct,
  ProductColor,
  Replica,
  Guest,
  Cart,
  CartItem,
  Notification,
  NotificationAddressee,
} from "./types/index.js";

const createOperationsDb = (
  path: string | undefined
): BetterSQLite3Database<typeof operations> => {
  const clientOperations = new Database(
    path ?? process.env.DB_OPERATIONS_PATH,
    {
      fileMustExist: true,
    }
  );
  clientOperations.pragma("journal_mode = WAL");
  return drizzle({ client: clientOperations, schema: operations });
};

const createCatalogDb = (
  path: string | undefined
): BetterSQLite3Database<typeof catalog> => {
  const clientCatalog = new Database(path ?? process.env.DB_CATALOG_PATH, {
    fileMustExist: true,
  });
  clientCatalog.pragma("journal_mode = WAL");
  return drizzle({ client: clientCatalog, schema: catalog });
};

export { createOperationsDb, createCatalogDb };
