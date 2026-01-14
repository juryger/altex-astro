import { createCatalogDb, type Category, eq } from "@/lib/dal";
import { categories } from "@/lib/dal/src/schema/catalog";

type CategoryServiceType = {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
};

const getReferenceService = (): CategoryServiceType => {
  return {
    getCategories: (): Promise<Category[]> => {
      return new Promise((resolve, reject) => {
        try {
          const db = createCatalogDb(process.env.DB_CATALOG_PATH);
          const categories = db.query.categories.findMany({
            limit: 10,
            offset: 0,
          });
          resolve(categories);
        } catch (error) {
          console.error(error);
          reject("Failed to fetch Categories");
        }
      });
    },
    getCategoryById: async (id: number): Promise<Category | undefined> => {
      try {
        const db = createCatalogDb(process.env.DB_CATALOG_PATH);
        const category = await db
          .select()
          .from(categories)
          .where(eq(categories.id, id))
          .limit(1);
        return Promise.resolve(category.length > 0 ? category[0] : undefined);
      } catch (error) {
        console.error(error);
        return Promise.reject(`Failed to fetch Category: ${id}`);
      }
    },
  };
};
