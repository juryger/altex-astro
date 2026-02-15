import type { CartItem } from "@/web/src/core/models/cart";
import type { GuestUser } from "@/web/src/core/models/guest-user";

type CartCheckouResult = {
  name: string;
  error?: Error;
};

interface CartManager {
  checkoutCart: (
    items: Array<CartItem>,
    guest?: GuestUser,
    userId?: number,
  ) => Promise<CartCheckouResult>;
}

function getCartManager(): CartManager {
  return {
    checkoutCart: async (
      items: Array<CartItem>,
      guest?: GuestUser,
      userId?: number,
    ): Promise<CartCheckouResult> => {
      // TODO:
      // * Create CartCheckout, CartCheckoutItems and save them to Operational DB
      // * Generate email for Customer with order items and customer details
      // * Generate email for Store with attached xml file containing order items and customer details
      // * Generate email for Admin in case of any exceptions
      return { name: "ONLINE-01" };
    },
  };
}

export { getCartManager };
