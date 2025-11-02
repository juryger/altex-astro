declare namespace App {
  interface SessionData {
    user: {
      id?: number;
      name?: string;
    };
    lastVisit: Date;
    cart: {
      id: number;
      productId: number;
      count: number;
    }[];
  }
}
