import { asc, createCatalogDb, SQL, colors, isNull } from "@/lib/dal";
import type { Color as DbColor, SQLiteColumn } from "@/lib/dal";
import {
  EnvironmentNames,
  selectEnvironment,
  type ProductColor,
} from "@/lib/domain";

const columnTitle: SQLiteColumn = colors.title;

const getSortCondition = (): SQL => {
  return asc(columnTitle);
};

const mapQueryResultToDomainModel = (entity: DbColor): ProductColor => {
  return <ProductColor>{
    id: entity.id,
    code: entity.code,
    title: entity.title,
    fillColor: entity.fillColor,
    borderColor: entity.borderColor,
    uid: entity.uid,
  };
};

export async function fetchProductColors(): Promise<ProductColor[]> {
  const db = createCatalogDb(
    selectEnvironment(EnvironmentNames.DB_CATALOG_PATH),
  );

  const queryResult = await db
    .select()
    .from(colors)
    .where(isNull(colors.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
