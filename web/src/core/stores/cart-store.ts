import { computed } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { CartSchema, type CartItem } from "@/lib/domain";

export const $cart = persistentAtom<CartItem[]>("cart", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Computed stores for total count and prices
export const $cartCount = computed([$cart], (items) => {
  return items.reduce((acc: number, curr: CartItem): number => {
    return acc + curr.quantity;
  }, 0);
});

export const $cartCost = computed([$cart], (items) => {
  return items.reduce((acc: number, curr: CartItem): number => {
    return acc + curr.quantity * curr.price;
  }, 0);
});

export const $cartWhsCost1 = computed([$cart], (items) => {
  return items.reduce((acc: number, curr: CartItem): number => {
    return acc + curr.quantity * curr.whsPrice1;
  }, 0);
});

export const $cartWhsCost2 = computed([$cart], (items) => {
  return items.reduce((acc: number, curr: CartItem): number => {
    return acc + curr.quantity * curr.whsPrice2;
  }, 0);
});

export function addToCart(value: CartItem): void {
  // execute Tranformation for derived properites
  const item = CartSchema.parse(value);
  const existingEntry = $cart.get().find((x) => x.id === item.id);

  $cart.set(
    existingEntry !== undefined
      ? [
          ...$cart.get().filter((x) => x.id !== item.id),
          {
            ...existingEntry,
            quantity: existingEntry.quantity + item.quantity,
          },
        ]
      : [...$cart.get(), { ...item }],
  );
}

export function updateCart(value: CartItem): void {
  // execute Tranformation for derived properites
  const item = CartSchema.parse(value);
  const existingEntry = $cart.get().find((x) => x.id === item.id);
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ Cannot update item in the cart, as it's not found by its ID:",
      item.id,
    );
    return;
  }

  $cart.set([
    ...$cart.get().filter((x) => x.id !== item.id),
    { ...existingEntry, quantity: item.quantity, colorId: item.colorId },
  ]);
}

export function removeFromCart(id: string): void {
  // execute Tranformation for derived properites
  const existingEntry = $cart.get().filter((x) => x.id === id);
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ Cannot remove item from the cart, as it's not found by its ID:",
      id,
    );
    return;
  }

  $cart.set([...$cart.get().filter((x) => x.id !== id)]);
}
