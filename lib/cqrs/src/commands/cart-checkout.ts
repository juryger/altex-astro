import type { CartItem, Discount } from "@/lib/domain";
import {
  EnvironmentNames,
  getErrorMessage,
  selectEnvironment,
} from "@/lib/domain";
import {
  createOperationsDb,
  cartCheckout,
  cartCheckoutItems,
  type OperationsDbTransaction,
} from "@/lib/dal";

export async function checkoutCart(
  items: Array<CartItem>,
  discounts: Array<Discount>,
  userUid?: string,
  guestUid?: string,
): Promise<number> {
  const cartSum = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );
  const discountIndex =
    discounts.findLastIndex((x) => cartSum >= x.fromSum) ?? 0;
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  let checkoutId: number = 0;
  return db.transaction((tx) => {
    try {
      const cart = tx
        .insert(cartCheckout)
        .values({
          userUid,
          guestUid,
        })
        .returning({ id: cartCheckout.id })
        .run();
      checkoutId = cart.lastInsertRowid as number;
      for (const item of items) {
        tx.insert(cartCheckoutItems)
          .values({
            cartCheckoutId: checkoutId,
            productUid: item.productUid,
            colorUid: item.colorUid,
            quantity: item.quantity,
            price:
              discountIndex === 0
                ? item.price
                : discountIndex === 1
                  ? item.whsPrice1
                  : item.whsPrice2,
          })
          .run();
      }
    } catch (error) {
      tx.rollback();
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    return checkoutId;
  });
}

export function checkoutCartTx(
  tx: OperationsDbTransaction,
  items: Array<CartItem>,
  discounts: Array<Discount>,
  userUid?: string,
  guestUid?: string,
): number {
  const cartSum = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );
  const discountIndex =
    discounts.findLastIndex((x) => cartSum >= x.fromSum) ?? 0;
  const cart = tx
    .insert(cartCheckout)
    .values({
      userUid,
      guestUid,
    })
    .returning({ id: cartCheckout.id })
    .run();
  const checkoutId = cart.lastInsertRowid as number;
  for (const item of items) {
    tx.insert(cartCheckoutItems)
      .values({
        cartCheckoutId: checkoutId,
        productUid: item.productUid,
        colorUid: item.colorUid,
        quantity: item.quantity,
        price:
          discountIndex === 0
            ? item.price
            : discountIndex === 1
              ? item.whsPrice1
              : item.whsPrice2,
      })
      .run();
  }
  return checkoutId;
}
