import { map } from "nanostores";
import type { CartItem } from "../models/cart";

export const $cartItems = map<Record<number, CartItem | undefined>>({});

export function addCartItem(value: CartItem) {
  const existingEntry = $cartItems.get()[value.id];
  if (existingEntry) {
    $cartItems.setKey(value.id, {
      ...existingEntry,
      orderQuantity: existingEntry.orderQuantity + value.orderQuantity,
    });
  } else {
    $cartItems.setKey(value.id, { ...value });
  }
}

export function updateCartItem(id: number, orderQuantity: number) {
  const existingEntry = $cartItems.get()[id];
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ cannot update quantity of the product in the cart as it's not found:",
      id
    );
    return;
  }
  $cartItems.setKey(id, {
    ...existingEntry,
    orderQuantity: orderQuantity,
  });
}

export function removeCartItem(id: number) {
  const existingEntry = $cartItems.get()[id];
  if (!existingEntry) {
    console.error(
      "~ cart-store ~ cannot remove product from the cart as it's not found:",
      id
    );
    return;
  }
  $cartItems.setKey(id, undefined);
}
