declare namespace App {
  interface SessionData {
    user?: {
      id: number;
      name: string;
    };
    catalog: {
      activeProductSlug?: string;
      activeCategorySlug?: string;
      activeParentCategorySlug?: string;
    };
  }
}
