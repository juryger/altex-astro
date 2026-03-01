import {
  EnvironmentNames,
  NO_VALUE_ASSIGNED,
  selectEnvironment,
} from "@/lib/domain";
import {
  createOperationsDb,
  eq,
  cartCheckoutItems,
  cartCheckout,
  guests,
  products,
  colors,
} from "@/lib/dal";
import type {
  CartCheckout as DBCartCheckout,
  CartCheckoutItem as DBCartCheckoutItem,
  Product as DBProduct,
  Color as DBColor,
  Guest as DBGuest,
} from "@/lib/dal";
import type {
  CartCheckoutAggregate,
  CartCheckoutItem,
  GuestUser,
} from "@/lib/domain";
import { formatCurrency } from "@/lib/domain";

type QueryResult = {
  cart_checkout: DBCartCheckout;
  cart_checkout_items: DBCartCheckoutItem;
  products: DBProduct;
  colors?: DBColor | null;
  guests?: DBGuest | null;
  customer?: any | null;
};

const mapQueryResultToDomainModel = (
  data: Array<QueryResult>,
): CartCheckoutAggregate | undefined => {
  if (data.length === 0) return undefined;
  return {
    root: {
      id: data[0]?.cart_checkout.id,
      userUid: data[0]?.cart_checkout.userUid ?? undefined,
      guestUid: data[0]?.cart_checkout.guestUid ?? undefined,
      createdAt: data[0]?.cart_checkout.createdAt,
    },
    items: data.map(
      (x) =>
        ({
          id: x.cart_checkout_items.id,
          cartCheckoutId: x.cart_checkout_items.cartCheckoutId,
          productUid: x.cart_checkout_items.productUid,
          productTitle: x.products.title,
          productSlug: x.products.slug,
          colorUid: x.cart_checkout_items.colorUid ?? undefined,
          colorTitle: x.colors?.title ?? NO_VALUE_ASSIGNED,
          quantity: x.cart_checkout_items.quantity,
          price: x.cart_checkout_items.price,
          priceLocal: formatCurrency(x.cart_checkout_items.price),
        }) as CartCheckoutItem,
    ),
    guest: {
      id: data[0]?.guests?.id,
      uid: data[0]?.guests?.uid,
      fullName: data[0]?.guests?.fullName,
      email: data[0]?.guests?.email,
      phone:
        data[0]?.guests?.phone && data[0]?.guests?.phone.trim().length > 0
          ? data[0]?.guests?.phone
          : NO_VALUE_ASSIGNED,
      companyName:
        data[0]?.guests?.companyName &&
        data[0]?.guests?.companyName.trim().length > 0
          ? data[0]?.guests?.companyName
          : NO_VALUE_ASSIGNED,
      address:
        data[0]?.guests?.address && data[0]?.guests?.address.trim().length > 0
          ? data[0]?.guests?.address
          : NO_VALUE_ASSIGNED,
      city:
        data[0]?.guests?.city && data[0]?.guests?.city.trim().length > 0
          ? data[0]?.guests?.city
          : NO_VALUE_ASSIGNED,
      postCode:
        data[0]?.guests?.postCode && data[0]?.guests?.postCode.trim().length > 0
          ? data[0]?.guests?.postCode
          : NO_VALUE_ASSIGNED,
      taxNumber:
        data[0]?.guests?.taxNumber &&
        data[0]?.guests?.taxNumber.trim().length > 0
          ? data[0]?.guests?.taxNumber
          : NO_VALUE_ASSIGNED,
    } as GuestUser,
    customer: undefined,
  };
};

export async function fetchCartCheckout(
  id: number,
): Promise<CartCheckoutAggregate | undefined> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const queryResult = await db
    .select()
    .from(cartCheckout)
    .innerJoin(
      cartCheckoutItems,
      eq(cartCheckout.id, cartCheckoutItems.cartCheckoutId),
    )
    .innerJoin(products, eq(products.uid, cartCheckoutItems.productUid))
    .leftJoin(guests, eq(cartCheckout.guestUid, guests.uid))
    .leftJoin(colors, eq(cartCheckoutItems.colorUid, colors.uid))
    .where(eq(cartCheckout.id, id));
  const result = mapQueryResultToDomainModel(queryResult);
  return result;
}
