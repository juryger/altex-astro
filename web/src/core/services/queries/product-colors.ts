import { asc, createCatalogDb, SQL, type SQLiteColumn } from "@/lib/dal/src";
import type { ProductColor } from "@/web/src/core/models/product-color";
import type { Color as DbColor } from "@/lib/dal/src/types";
import { isNull } from "@/lib/dal";
import { colors } from "@/lib/dal/src/schema/catalog";

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
  };
};

export async function fetchProductColors(): Promise<ProductColor[]> {
  const db = createCatalogDb(import.meta.env.DB_CATALOG_PATH);

  const queryResult = await db
    .select()
    .from(colors)
    .where(isNull(colors.deletedAt))
    .orderBy(getSortCondition());

  return queryResult.map((item) => mapQueryResultToDomainModel(item));
}
