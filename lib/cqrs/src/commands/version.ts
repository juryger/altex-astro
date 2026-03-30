import {
  type DatabaseSchema,
  type DatabaseTransaction,
  type CatalogVersion as DBVersion,
  catalogVersion,
} from "@/lib/dal";

export function setVersionTx(
  tx: DatabaseTransaction<DatabaseSchema>,
  name: string,
): number {
  const result = tx
    .insert(catalogVersion)
    .values({ name } as DBVersion)
    .onConflictDoUpdate({
      target: catalogVersion.name,
      set: {
        createdAt: new Date(),
      },
    })
    .returning({ insertedId: catalogVersion.id })
    .run();
  return result.lastInsertRowid as number;
}
