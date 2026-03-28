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
    description: entity.description !== undefined ? entity.description : null,
    hasImage: entity.hasImage !== undefined ? entity.hasImage : null,
    parentId: entity.parentId !== undefined ? entity.parentId : null,
    deletedAt: entity.deletedAt !== undefined ? entity.deletedAt : null,
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
        description: value.description !== undefined ? value.description : null,
        hasImage: value.hasImage !== undefined ? value.hasImage : null,
        parentId: value.parentId !== undefined ? value.parentId : null,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt !== undefined ? value.deletedAt : null,
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
      console.error(
        "❌ ~ cqrs ~ parent category not found '%s'",
        value.parentUid,
      );
      throw new Error(
        `Unable to save category record as related parent category with id '${value.parentUid}' could not be retrieved.`,
      );
    }
  }
  const result = tx
    .insert(categories)
    .values(
      mapDomainToDatabaseModel({
        ...value,
        parentId: parent !== undefined ? parent.id : undefined,
      }),
    )
    .onConflictDoUpdate({
      target: categories.uid,
      set: {
        parentId: parent !== undefined ? parent.id : null,
        slug: value.slug,
        title: value.title,
        description: value.description !== undefined ? value.description : null,
        hasImage: value.hasImage !== undefined ? value.hasImage : 0,
        modifiedAt: value.modifiedAt,
        deletedAt: value.deletedAt !== undefined ? value.deletedAt : null,
      },
    })
    .returning({ insertedId: categories.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
