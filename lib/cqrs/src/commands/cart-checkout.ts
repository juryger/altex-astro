import type { CartItem, Discount } from "@/lib/domain";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { createOperationsDb, cartCheckout, cartCheckoutItems } from "@/lib/dal";

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
  return db.transaction((tx) => {
    const cart = tx
      .insert(cartCheckout)
      .values({
        userUid,
        guestUid,
      })
      .returning({ id: cartCheckout.id })
      .all();
    const checkoutId = cart.at(0)?.id ?? 0;

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
  });
}
