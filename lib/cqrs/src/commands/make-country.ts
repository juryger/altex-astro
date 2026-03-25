import type {
  CatalogDbTransaction,
  MakeCountry as DBMakeCountry,
} from "@/lib/dal";
import { createCatalogDb, makeCountries } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { MakeCountry } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: MakeCountry): DBMakeCountry => {
  return {
    uid: entity.uid,
    title: entity.title,
  } as DBMakeCountry;
};

export async function upsertMakeCountry(value: MakeCountry): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(makeCountries)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: makeCountries.uid,
      set: {
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: makeCountries.id });
  return result.at(0)?.insertedId ?? 0;
}

export function upsertMakeCountryTx(
  tx: CatalogDbTransaction,
  value: MakeCountry,
): string {
  const result = tx
    .insert(makeCountries)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: makeCountries.uid,
      set: {
        title: value.title,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: makeCountries.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
