import type { InferSelectModel } from "drizzle-orm";
import type {
  categories,
  colors,
  discounts,
  maker,
  countryMake,
  productColors,
  products,
  measurementUnits,
  relatedProducts,
} from "../schema/catalog";
import type {
  cart,
  cartItems,
  guests,
  notificationAddressees,
  notifications,
  replicas,
} from "../schema/operations";

// Catalog
export type MeasurementUnit = InferSelectModel<typeof measurementUnits>;
export type Color = InferSelectModel<typeof colors>;
export type CountryMake = InferSelectModel<typeof countryMake>;
export type Maker = InferSelectModel<typeof maker>;
export type Discount = InferSelectModel<typeof discounts>;
export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type ProductColor = InferSelectModel<typeof productColors>;
export type RelatedProduct = InferSelectModel<typeof relatedProducts>;

// Operations
export type Replica = InferSelectModel<typeof replicas>;
export type Guest = InferSelectModel<typeof guests>;
export type Cart = InferSelectModel<typeof cart>;
export type CartItem = InferSelectModel<typeof cartItems>;
export type Notification = InferSelectModel<typeof notifications>;
export type NotificationAddressee = InferSelectModel<
  typeof notificationAddressees
>;
