import type { ReadReplica as DBReadReplica } from "@/lib/dal";
import { createOperationsDb, readReplicas } from "@/lib/dal";
import { EnvironmentNames, selectEnvironment } from "@/lib/domain";
import { ReadReplicaTypes } from "@/lib/domain";

const mapDomainToDatabaseModel = ({
  type,
  fileName,
  deletedAt,
}: {
  type: ReadReplicaTypes;
  fileName: string;
  deletedAt?: Date | undefined;
}): DBReadReplica => {
  const result = {
    type: type,
    fileName: fileName,
    deletedAt: deletedAt ?? null,
  } as DBReadReplica;
  return result;
};

export async function setReadReplica({
  type,
  fileName,
  deletedAt,
}: {
  type: ReadReplicaTypes;
  fileName: string;
  deletedAt?: Date | undefined;
}): Promise<number> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  const result = await db
    .insert(readReplicas)
    .values(mapDomainToDatabaseModel({ type, fileName, deletedAt }))
    .onConflictDoUpdate({
      target: readReplicas.fileName,
      set: {
        type,
        createdAt: new Date(),
        deletedAt: deletedAt !== undefined ? deletedAt : null,
      },
    })
    .returning({ insertedId: readReplicas.id });
  return result.at(0)?.insertedId ?? 0;
}
