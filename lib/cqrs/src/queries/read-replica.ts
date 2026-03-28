import {
  createGeneralDb,
  and,
  eq,
  isNull,
  desc,
  readReplicas,
} from "@/lib/dal";
import type { SQLiteColumn, ReadReplica as DBReadReplica } from "@/lib/dal";
import {
  EnvironmentNames,
  ReadReplicaTypes,
  selectEnvironment,
  type ReadReplica,
} from "@/lib/domain";

const columnCreatedAt: SQLiteColumn = readReplicas.createdAt;

const mapQueryResultToDomainModel = (entity: DBReadReplica): ReadReplica => {
  return <ReadReplica>{
    id: entity.id,
    type: entity.type,
    fileName: entity.fileName,
    createdAt: entity.createdAt,
  };
};

export async function fetchCurrentReadReplica(
  type: number = ReadReplicaTypes.Catalog,
): Promise<ReadReplica | undefined> {
  const db = createGeneralDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const replica = await db
    .select()
    .from(readReplicas)
    .where(and(eq(readReplicas.type, type), isNull(readReplicas.deletedAt)))
    .orderBy(desc(columnCreatedAt))
    .limit(1);
  const item = replica.at(0);
  return item !== undefined ? mapQueryResultToDomainModel(item) : undefined;
}
