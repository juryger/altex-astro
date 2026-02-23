import type { CartItem, Discount } from "@/lib/domain";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { createOperationsDb, cartCheckout, cartCheckoutItems } from "@/lib/dal";

export async function checkoutCart(
  items: Array<CartItem>,
  discounts: Array<Discount>,
  userId?: string,
  guestId?: string,
): Promise<number> {
  const cartSum = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  const discountId = discounts.findLast((x) => cartSum >= x.fromSum)?.id ?? 0;

  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  return db.transaction((tx) => {
    const cart = tx
      .insert(cartCheckout)
      .values({
        userId,
        guestId,
      })
      .returning({ id: cartCheckout.id })
      .all();
    const result = cart.at(0)?.id ?? 0;

    for (const item of items) {
      tx.insert(cartCheckoutItems)
        .values({
          cartCheckoutId: result,
          productId: item.productId,
          colorId: item.color,
          quantity: item.quantity,
          price:
            discountId === 0
              ? item.price
              : discountId === 1
                ? item.whsPrice1
                : item.whsPrice2,
        })
        .run();
    }

    return result;
  });
}
