import type { ReadReplica, ReadReplicaTypes } from "@/lib/domain";
import type { ReadReplica as DBReadReplica } from "@/lib/dal";
import { createOperationsDb, readReplicas } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";

const mapDomainToDatabaseModel = (
  entity: ReadReplica,
  syncLog: string | null = null,
  hasErrors: boolean = false,
): DBReadReplica => {
  return {
    id: entity.id,
    type: entity.type,
    fileName: entity.fileName,
    syncLog: syncLog !== undefined ? syncLog : null,
    hasErrors: hasErrors ? 1 : 0,
  } as DBReadReplica;
};

export async function setReadReplica({
  type,
  hasErrors = false,
  syncLog = null,
}: {
  type: ReadReplicaTypes;
  hasErrors: boolean;
  syncLog: string | null;
}): Promise<number> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const result = await db
    .insert(readReplicas)
    .values(
      mapDomainToDatabaseModel({
        type,
        fileName: `${type}-${Date.now()}.db`,
        hasErrors,
        syncLog,
      } as ReadReplica),
    )
    .returning({ insertedId: readReplicas.id });

  return result.at(0)?.insertedId ?? 0;
}
