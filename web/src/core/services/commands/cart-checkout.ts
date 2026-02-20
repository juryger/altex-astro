import type { CartItem } from "@/web/src/core/models/cart";
import { getQueryManager } from "../queryManager";
import { fetchDiscounts } from "../queries/discounts";
import { getCacheInfo } from "@/web/src/core/models/cache";
import { CacheKeys } from "@/web/src/core/const/cache";
import {
  cartCheckout,
  cartCheckoutItems,
} from "@/lib/dal/src/schema/operations";
import { createOperationsDb } from "@/lib/dal/src";

export async function checkoutCart(
  items: Array<CartItem>,
  userId?: string,
  guestId?: string,
): Promise<number> {
  const cartSum = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );

  const discounts = await getQueryManager().fetch(
    () => fetchDiscounts(),
    getCacheInfo(CacheKeys.Discounts),
  );
  const discountId =
    discounts.data?.findLast((x) => cartSum >= x.fromSum)?.id ?? 0;

  const db = createOperationsDb(import.meta.env.DB_OPERATIONS_PATH);
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
