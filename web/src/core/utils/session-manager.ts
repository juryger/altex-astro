import { type AstroSession } from "astro";
import { SessionNames, type SessionNames as SessionKeyType } from "../const";

interface SessionManager {
  setActiveCatalogItem(
    productSlug: string | undefined,
    categorySlug: string | undefined,
    parentCategorySlug: string | undefined
  ): void;
  resetActiveCatalogItem(): void;
}

export function getSessionManager(session?: AstroSession<any>): SessionManager {
  return {
    setActiveCatalogItem: (
      productSlug: string | undefined,
      categorySlug: string | undefined,
      parentCategorySlug: string | undefined
    ) => {
      session?.set(SessionNames.Catalog, {
        activeProductSlug: productSlug,
        activeCategorySlug: categorySlug,
        activeParentCategorySlug: parentCategorySlug,
      });
    },
    resetActiveCatalogItem: () => {
      session?.set(SessionNames.Catalog, {
        activeProductSlug: undefined,
        activeCategorySlug: undefined,
        activeParentCategorySlug: undefined,
      });
    },
  };
}
