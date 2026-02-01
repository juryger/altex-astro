import { type AstroSession } from "astro";
import { FilterOperator, SessionNames, SortOrder } from "../const";

type CatalogItem = {
  slug: string;
  title: string;
};

type ActiveCatalogItem = {
  parentCategory?: CatalogItem;
  category?: CatalogItem;
  product?: CatalogItem;
};

type SortItem = {
  field: string;
  order: SortOrder;
};

type FilterItem = {
  field: string;
  value: string;
  operator: FilterOperator;
};

type ProductsView = {
  sorting?: SortItem;
  filtering?: Array<FilterItem>;
};

type OrdersView = {
  sorting?: SortItem;
  filtering?: Array<FilterItem>;
};

type OrderProductsView = {
  sorting?: SortItem;
  filtering?: Array<FilterItem>;
};

interface SessionManager {
  getActiveCatalogItem(): Promise<ActiveCatalogItem | undefined>;
  setActiveCatalogItem(value: ActiveCatalogItem): void;
  resetActiveCatalogItem(): void;
  getProductsView(): Promise<ProductsView | undefined>;
  setProductsView(value: ProductsView): void;
  resetProductsView(): void;
  getOrdersView(): Promise<OrdersView | undefined>;
  setOrdersView(value: OrdersView): void;
  resetOrdersView(): void;
  getOrderProductsView(): Promise<OrderProductsView | undefined>;
  setOrderProductsView(value: OrderProductsView): void;
  resetOrderProductsView(): void;
}

function getSessionManager(session?: AstroSession<any>): SessionManager {
  return {
    getActiveCatalogItem: async (): Promise<ActiveCatalogItem | undefined> => {
      const catalogItem = await session?.get(SessionNames.ActiveCatalogItem);
      return catalogItem;
    },
    setActiveCatalogItem: (value: ActiveCatalogItem) => {
      session?.set(SessionNames.ActiveCatalogItem, {
        parentCategory: value.parentCategory,
        category: value.category,
        product: value.product,
      });
    },
    resetActiveCatalogItem: () => {
      session?.set(SessionNames.ActiveCatalogItem, {
        parentCategory: undefined,
        category: undefined,
        product: undefined,
      });
    },
    getProductsView: async (): Promise<ProductsView | undefined> => {
      const productsView = await session?.get(SessionNames.ProductsView);
      return productsView;
    },
    setProductsView: (value: ProductsView) => {
      session?.set(SessionNames.ProductsView, value);
    },
    resetProductsView: () => {
      session?.set(SessionNames.ProductsView, {
        sorting: undefined,
        filtering: undefined,
      });
    },
    getOrdersView: async (): Promise<OrdersView | undefined> => {
      const ordersView = await session?.get(SessionNames.OrdersView);
      return ordersView;
    },
    setOrdersView: (value: OrdersView) => {
      session?.set(SessionNames.OrdersView, value);
    },
    resetOrdersView: () => {
      session?.set(SessionNames.OrdersView, {
        sorting: undefined,
        filtering: undefined,
      });
    },
    getOrderProductsView: async (): Promise<OrderProductsView | undefined> => {
      const orderProductsView = await session?.get(
        SessionNames.OrderProductsView,
      );
      return orderProductsView;
    },
    setOrderProductsView: (value: OrderProductsView) => {
      session?.set(SessionNames.OrderProductsView, value);
    },
    resetOrderProductsView: () => {
      session?.set(SessionNames.OrderProductsView, {
        sorting: undefined,
        filtering: undefined,
      });
    },
  };
}

export {
  type ActiveCatalogItem,
  type ProductsView,
  type OrdersView,
  type OrderProductsView,
  getSessionManager,
};
