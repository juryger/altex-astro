declare namespace App {
  interface SessionData {
    user?: {
      id: number;
      name: string;
    };
    activeCatalogItem: {
      parentCategory?: {
        slug: string;
        title: string;
      };
      category?: {
        slug: string;
        title: string;
      };
      product?: {
        slug: string;
        title: string;
      };
    };
    productsView: {
      sorting?: {
        field: string;
        order: number;
      };
      filtering?: Array<{
        field: string;
        value: string;
        operator: number;
      }>;
    };
    ordersView: {
      sorting?: {
        field: string;
        order: number;
      };
      filtering?: Array<{
        field: string;
        value: string;
        operator: number;
      }>;
    };
    orderProductsView: {
      sorting?: {
        field: string;
        order: number;
      };
      filtering?: Array<{
        field: string;
        value: string;
        operator: number;
      }>;
    };
  }
}
