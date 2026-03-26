import type {
  DatabaseTransaction,
  DatabaseSchema,
  Category as DBCategory,
} from "@/lib/dal";
import { createCatalogDb, categories, eq } from "@/lib/dal";
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
  tx: DatabaseTransaction<DatabaseSchema>,
  value: Category,
): string {
  let parent: DBCategory | undefined = undefined;
  if (value.parentUid !== undefined) {
    parent = tx
      .select()
      .from(categories)
      .where(eq(categories.uid, value.parentUid))
      .limit(1)
      .get();
    if (parent === undefined) {
      throw new Error(
        `Unable to save category record as its parent category with id '${value.parentUid}' could not be retrieved.`,
      );
    }
  }
  const result = tx
    .insert(categories)
    .values(
      mapDomainToDatabaseModel({
        ...value,
        parentId: parent?.id,
      }),
    )
    .onConflictDoUpdate({
      target: categories.uid,
      set: {
        parentId: parent?.id,
        slug: value.slug,
        title: value.title,
        description: value.description,
        hasImage: value.hasImage,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: categories.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
