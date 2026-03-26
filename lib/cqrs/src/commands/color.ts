import type {
  DatabaseTransaction,
  DatabaseSchema,
  Color as DBColor,
} from "@/lib/dal";
import { createCatalogDb, colors } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import type { Color } from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: Color): DBColor => {
  return {
    uid: entity.uid,
    code: entity.code,
    title: entity.title,
    fillColor: entity.fillColor,
    borderColor: entity.borderColor,
  } as DBColor;
};

export async function upsertColor(value: Color): Promise<number> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );
  const result = await db
    .insert(colors)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: colors.uid,
      set: {
        code: value.code,
        title: value.title,
        fillColor: value.fillColor,
        borderColor: value.borderColor,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: colors.id });
  return result.at(0)?.insertedId ?? 0;
}

export function upsertColorTx(
  tx: DatabaseTransaction<DatabaseSchema>,
  value: Color,
): string {
  const result = tx
    .insert(colors)
    .values(mapDomainToDatabaseModel(value))
    .onConflictDoUpdate({
      target: colors.uid,
      set: {
        code: value.code,
        title: value.title,
        fillColor: value.fillColor,
        borderColor: value.borderColor,
        deletedAt: value.deletedAt,
      },
    })
    .returning({ insertedId: colors.id })
    .run();
  return result.changes > 0 ? value.uid : "";
}
