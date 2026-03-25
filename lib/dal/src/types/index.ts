import type { ExtractTablesWithRelations, InferSelectModel } from "drizzle-orm";
import type { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import type Database from "better-sqlite3";
import {
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
} from "../schema/catalog";

import {
  cartCheckout,
  cartCheckoutItems,
  guests,
  notificationAddressees,
  notifications,
  readReplicas,
  operationsVersion,
  syncLog,
} from "../schema/operations";
import { info, generalVersion } from "../schema/general";

// Catalog
export type CatalogVersion = InferSelectModel<typeof catalogVersion>;
export type MeasurementUnit = InferSelectModel<typeof measurementUnits>;
export type Color = InferSelectModel<typeof colors>;
export type MakeCountry = InferSelectModel<typeof makeCountries>;
export type Maker = InferSelectModel<typeof makers>;
export type Discount = InferSelectModel<typeof discounts>;
export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type ProductColor = InferSelectModel<typeof productColors>;
export type RelatedProduct = InferSelectModel<typeof relatedProducts>;

// Operations
export type OperationVersion = InferSelectModel<typeof operationsVersion>;
export type ReadReplica = InferSelectModel<typeof readReplicas>;
export type SyncLog = InferSelectModel<typeof syncLog>;
export type Guest = InferSelectModel<typeof guests>;
export type CartCheckout = InferSelectModel<typeof cartCheckout>;
export type CartCheckoutItem = InferSelectModel<typeof cartCheckoutItems>;
export type Notification = InferSelectModel<typeof notifications>;
export type NotificationAddressee = InferSelectModel<
  typeof notificationAddressees
>;

// General
export type GeneralVersion = InferSelectModel<typeof generalVersion>;
export type Info = InferSelectModel<typeof info>;

export enum DatabaseType {
  Catalog = 0,
  General = 1,
  Operatons = 2,
}

export type DatabaseSchema = Record<string, unknown>;
export type DatabaseTransaction<TSchema extends DatabaseSchema> =
  SQLiteTransaction<
    "sync",
    Database.RunResult,
    TSchema,
    ExtractTablesWithRelations<TSchema>
  >;
