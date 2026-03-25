import type { CatalogDbTransaction, Category as DBCategory } from "@/lib/dal";
import { createCatalogDb, categories } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { Category } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: Category): DBCategory => {
  return {
    uid: entity.uid,
    slug: entity.slug,
    title: entity.title,
    description: entity.description,
    hasImage: entity.hasImage,
    parentId: entity.parentId,
  } as DBCategory;
};

export async function upsertCategory(value: Category): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(categories)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: categories.uid,
      set: {
        slug: value.slug,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        parentId: value.parentId,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: categories.id });
  return result.at(0)?.insertedId ?? 0;
}

export function upsertCategoryTx(
  tx: CatalogDbTransaction,
  value: Category,
): string {
  const result = tx
    .insert(categories)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: categories.uid,
      set: {
        slug: value.slug,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        parentId: value.parentId,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: categories.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
