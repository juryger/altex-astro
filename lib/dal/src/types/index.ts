import type { InferSelectModel } from "drizzle-orm";

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
