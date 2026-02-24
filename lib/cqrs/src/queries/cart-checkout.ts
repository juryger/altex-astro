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
import type { CartCheckoutAggregate } from "@/lib/domain";

type QueryResult = {
  cart_checkout: DBCartCheckout;
  cart_checkout_items: DBCartCheckoutItem;
  guest?: DbGuest | undefined;
  customer?: any | undefined;
};

const mapQueryResultToDomainModel = (
  data: Array<QueryResult>,
): CartCheckoutAggregate | undefined => {
  if (data.length === 0) return undefined;
  return {
    root: {
      id: data[0]?.cart_checkout.id,
      userId: data[0]?.cart_checkout.userId ?? undefined,
      guestId: data[0]?.cart_checkout.guestId ?? undefined,
      createdAt: data[0]?.cart_checkout.createdAt,
    },
    items: data.map((x) => ({
      id: x.cart_checkout_items.id,
      cartCheckoutId: x.cart_checkout_items.cartCheckoutId,
      productId: x.cart_checkout_items.productId,
      colorId: x.cart_checkout_items.colorId ?? undefined,
      quantity: x.cart_checkout_items.quantity,
      price: x.cart_checkout_items.price,
    })),
    guest: {
      id: data[0]?.guest?.id,
      fullName: data[0]?.guest?.fullName,
      email: data[0]?.guest?.email,
      phone: data[0]?.guest?.phone ?? undefined,
      compnayName: data[0]?.guest?.compnayName ?? undefined,
      address: data[0]?.guest?.address ?? undefined,
      city: data[0]?.guest?.city ?? undefined,
      postCode: data[0]?.guest?.postCode ?? undefined,
      taxNumber: data[0]?.guest?.taxNumber ?? undefined,
      uid: data[0]?.guest?.uid,
    },
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
    .leftJoin(guests, eq(cartCheckout.guestId, guests.uid))
    .where(eq(cartCheckout.id, id));
  return mapQueryResultToDomainModel(queryResult);
}
