import type { Maker as DBMaker } from "@/lib/dal";
import { createCatalogDb, makers } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { Maker } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: Maker): DBMaker => {
  return {
    uid: entity.uid,
    title: entity.title,
  } as DBMaker;
};

export async function upsertMaker(value: Maker): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(makers)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: makers.uid,
      set: {
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: makers.id });

  return result.at(0)?.insertedId ?? 0;
}
