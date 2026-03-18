import type { ReadReplica } from "@/lib/domain";
import type { ReadReplica as DBReadReplica } from "@/lib/dal";
import { createOperationsDb, readReplicas } from "@/lib/dal";
import {
  EnvironmentNames,
  selectEnvironment,
  ReadReplicaTypes,
} from "@/lib/domain";

const mapDomainToDatabaseModel = (entity: ReadReplica): DBReadReplica => {
  return {
    id: entity.id,
    type: entity.type,
    fileName: entity.fileName,
  } as DBReadReplica;
};

export async function setReadReplica({
  type,
}: {
  type: ReadReplicaTypes;
}): Promise<number> {
  const db = createOperationsDb(
    selectEnvironment(EnvironmentNames.DB_OPERATIONS_PATH),
  );
  let name: string;
  switch (type) {
    case ReadReplicaTypes.Catalog:
      name = "catalog";
      break;
    default:
      console.error("Unsupported read replica type:", type);
      name = "unsupported";
      break;
  }
  const result = await db
    .insert(readReplicas)
    .values(
      mapDomainToDatabaseModel({
        type,
        fileName: `${name}-${Date.now()}.db`,
      } as ReadReplica),
    )
    .returning({ insertedId: readReplicas.id });

  return result.at(0)?.insertedId ?? 0;
}
