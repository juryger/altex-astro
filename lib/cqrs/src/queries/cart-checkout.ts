import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import {
  createOperationsDb,
  eq,
  cartCheckoutItems,
  cartCheckout,
  guests,
} from "@/lib/dal";
import type {
  CartCheckout as DBCartCheckout,
  CartCheckoutItem as DBCartCheckoutItem,
  Guest as DbGuest,
} from "@/lib/dal";
import type {
  CartCheckoutAggregate,
  CartCheckoutItem,
  GuestUser,
} from "@/lib/domain";

type QueryResult = {
  cart_checkout: DBCartCheckout;
  cart_checkout_items: DBCartCheckoutItem;
  guests?: DbGuest | null;
  customer?: any | null;
};

const mapQueryResultToDomainModel = (
  data: Array<QueryResult>,
): CartCheckoutAggregate | undefined => {
  if (data.length === 0) return undefined;
  console.log("🧪 ~ query:cart-checkout ~ query result", data);
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
          colorUid: x.cart_checkout_items.colorUid ?? undefined,
          quantity: x.cart_checkout_items.quantity,
          price: x.cart_checkout_items.price,
        }) as CartCheckoutItem,
    ),
    guest: {
      id: data[0]?.guests?.id,
      fullName: data[0]?.guests?.fullName,
      email: data[0]?.guests?.email,
      phone: data[0]?.guests?.phone ?? undefined,
      compnayName: data[0]?.guests?.compnayName ?? undefined,
      address: data[0]?.guests?.address ?? undefined,
      city: data[0]?.guests?.city ?? undefined,
      postCode: data[0]?.guests?.postCode ?? undefined,
      taxNumber: data[0]?.guests?.taxNumber ?? undefined,
      uid: data[0]?.guests?.uid,
    } as GuestUser,
    customer: undefined,
  };
};

export async function fetchCartCheckout(
  id: number,
): Promise<CartCheckoutAggregate | undefined> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const queryResult = await db
    .select()
    .from(cartCheckout)
    .innerJoin(
      cartCheckoutItems,
      eq(cartCheckout.id, cartCheckoutItems.cartCheckoutId),
    )
    .leftJoin(guests, eq(cartCheckout.guestUid, guests.uid))
    .where(eq(cartCheckout.id, id));
  return mapQueryResultToDomainModel(queryResult);
}
