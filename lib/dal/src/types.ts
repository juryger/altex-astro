import type { InferSelectModel } from "drizzle-orm";
import type {
  categories,
  colors,
  countryMake,
  discounts,
  productColors,
  products,
  units,
} from "./schema/catalog";
import type {
  cart,
  cartItems,
  guests,
  notificationAdressees,
  notifications,
  replicas,
} from "./schema/operations";

// Catalog
export type Units = InferSelectModel<typeof units>;
export type Colors = InferSelectModel<typeof colors>;
export type CountryMake = InferSelectModel<typeof countryMake>;
export type Discounts = InferSelectModel<typeof discounts>;
export type Categories = InferSelectModel<typeof categories>;
export type Products = InferSelectModel<typeof products>;
export type ProductColors = InferSelectModel<typeof productColors>;
export type Category = InferSelectModel<typeof categories>;

// Operations
export type Replicas = InferSelectModel<typeof replicas>;
export type Guests = InferSelectModel<typeof guests>;
export type Cart = InferSelectModel<typeof cart>;
export type CartItems = InferSelectModel<typeof cartItems>;
export type Notifications = InferSelectModel<typeof notifications>;
export type NotificationAddresses = InferSelectModel<
  typeof notificationAdressees
>;
