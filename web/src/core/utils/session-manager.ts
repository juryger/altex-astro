import { type AstroSession } from "astro";
import { SessionNames, type SessionNames as SessionKeyType } from "../const";

type CatalogItem = {
  slug: string;
  title: string;
};

type ActiveCatalogItem = {
  parentCategory?: CatalogItem;
  category?: CatalogItem;
  product?: CatalogItem;
};

interface SessionManager {
  getActiveCatalogItem(): Promise<ActiveCatalogItem | undefined>;
  setActiveCatalogItem(value: ActiveCatalogItem): void;
  resetActiveCatalogItem(): void;
}

function getSessionManager(session?: AstroSession<any>): SessionManager {
  return {
    getActiveCatalogItem: async (): Promise<ActiveCatalogItem | undefined> => {
      const catalog = await session?.get(SessionNames.Catalog);
      if (catalog === undefined) return undefined;
      return catalog?.activeItem;
    },
    setActiveCatalogItem: (value: ActiveCatalogItem) => {
      session?.set(SessionNames.Catalog, {
        activeItem: {
          parentCategory: value.parentCategory,
          category: value.category,
          product: value.product,
        },
      });
    },
    resetActiveCatalogItem: () => {
      session?.set(SessionNames.Catalog, {
        activeItem: {
          parentCategory: undefined,
          category: undefined,
          product: undefined,
        },
      });
    },
  };
}

export { type ActiveCatalogItem, type CatalogItem, getSessionManager };
