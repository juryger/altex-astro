import { computed } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";
import { CartSchema, type CartItem } from "../models/cart";

export const $cart = persistentAtom<CartItem[]>("cart", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Computed stores for total count and prices
export const $cartCount = computed([$cart], (items) => {
  return items.reduce((acc: number, current: CartItem): number => {
    return acc + current.quantity;
  }, 0);
});

export const $cartCost = computed([$cart], (items) => {
  return items.reduce((acc: number, current: CartItem): number => {
    return acc + current.quantity * current.price;
  }, 0);
});

export const $cartWhsCost1 = computed([$cart], (items) => {
  return items.reduce((acc: number, current: CartItem): number => {
    return acc + current.quantity * current.whsPrice1;
  }, 0);
});

export const $cartWhsCost2 = computed([$cart], (items) => {
  return items.reduce((acc: number, current: CartItem): number => {
    return acc + current.quantity * current.whsPrice2;
  }, 0);
});

export function addToCart(value: CartItem): void {
  const item = CartSchema.parse(value);
  console.log("~ cart-store ~ added new item:", item);

  const existingEntry = $cart.get().find((x) => x.id === item.id);
  console.log("~ cart-store ~ existing item:", existingEntry);

  $cart.set(
    existingEntry !== undefined
      ? [
          ...$cart.get().filter((x) => x.id !== item.id),
          {
            ...existingEntry,
            quantity: existingEntry.quantity + item.quantity,
          },
        ]
      : [...$cart.get(), { ...item }]
  );
}

export function updateCart(value: CartItem): void {
  const item = CartSchema.parse(value);
  console.log("~ cart-store ~ update cart item:", item);

  const existingEntry = $cart.get().find((x) => x.id === item.id);
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ Cannot update item in the cart, as it's not found by its ID:",
      item.id
    );
    return;
  }

  $cart.set([
    ...$cart.get().filter((x) => x.id !== item.id),
    { ...existingEntry, quantity: item.quantity, color: item.color },
  ]);
}

export function removeFromCart(id: string): void {
  console.log("~ cart-store ~ remove cart item with ID:", id);

  const existingEntry = $cart.get().filter((x) => x.id === id);
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ Cannot remove item from the cart, as it's not found by its ID:",
      id
    );
    return;
  }

  $cart.set([...$cart.get().filter((x) => x.id !== id)]);
}
