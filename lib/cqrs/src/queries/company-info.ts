import { createGeneralDb, info, isNull } from "@/lib/dal";
import type { Info } from "@/lib/dal";
import type { CompanyInfo } from "@/lib/domain";
import {
  EnvironmentNames,
  parseCompanyInfo,
  selectEnvironment,
} from "@/lib/domain";

const mapQueryResultToDomainModel = (entity: Info): CompanyInfo => {
  return <CompanyInfo>{
    id: entity.id,
    name: entity.name,
    value: entity.value,
    createdAt: entity.createdAt,
    deletedAt: entity.deletedAt,
  };
};

export async function fetchCompanyInfo(): Promise<Record<string, string>> {
  const db = createGeneralDb(
    selectEnvironment(EnvironmentNames.DB_GENERAL_PATH),
  );

  const queryResult = await db
    .select()
    .from(info)
    .where(isNull(info.deletedAt));

  return parseCompanyInfo(
    queryResult.map((item) => mapQueryResultToDomainModel(item)),
  );
}
